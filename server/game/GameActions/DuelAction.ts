import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, DuelTypes, EventNames, Durations } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Duel = require('../Duel');
import DuelFlow = require('../gamesteps/DuelFlow');
import { GameAction } from './GameAction';

export interface DuelProperties extends CardActionProperties {
    type: DuelTypes;
    challenger?: DrawCard;
    gameAction: GameAction | ((duel: Duel, context: AbilityContext) => GameAction);
    message?: string;
    messageArgs?: (duel: Duel, context: AbilityContext) => any | any[];
    costHandler?: (context: AbilityContext, prompt: any) => void;
    statistic?: (card: DrawCard) => number;
    challengerEffect?;
    targetEffect?;
    refuseGameAction?: GameAction;
}

export class DuelAction extends CardGameAction {
    name = 'duel';
    eventName = EventNames.OnDuelInitiated;
    targetType = [CardTypes.Character];

    defaultProperties: DuelProperties = {
        type: undefined,
        gameAction: null
    };

    getProperties(context: AbilityContext, additionalProperties = {}): DuelProperties {
        let properties = super.getProperties(context, additionalProperties) as DuelProperties;
        if(!properties.challenger) {
            properties.challenger = context.source;
        }
        return properties;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context);
        if(properties.target instanceof Array) {
            let targets = properties.target as DrawCard[];
            let indices = [...Array(targets.length + 1).keys()].map(x => '{' + x++ + '}').slice(1);
            return ['initiate a ' + properties.type.toString() + ' duel : {0} vs. ' + indices.join(' and '), [properties.challenger, ...(properties.target as DrawCard[])]];
        }
        return ['initiate a ' + properties.type.toString() + ' duel : {0} vs. {1}', [properties.challenger, properties.target]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        if(!context.player.opponent) {
            return false;
        }

        let properties = this.getProperties(context, additionalProperties);
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(card === properties.challenger) {
            return false; //cannot duel yourself
        }
        return properties.challenger && !properties.challenger.hasDash(properties.type) && card.location === Locations.PlayArea && !card.hasDash(properties.type);
    }

    resolveDuel(duel: Duel, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        let gameAction = typeof(properties.gameAction) === 'function' ? properties.gameAction(duel, context) : properties.gameAction;
        if(gameAction && gameAction.hasLegalTarget(context)) {
            let message, messageArgs;
            if(properties.message) {
                message = properties.message;
                messageArgs = properties.messageArgs ? [].concat(properties.messageArgs(duel, context)) : [];
            } else {
                [message, messageArgs] = gameAction.getEffectMessage(context);
            }
            context.game.addMessage('Duel Effect: ' + message, ...messageArgs);
            gameAction.resolve(null, context);
        } else {
            context.game.addMessage('The duel has no effect')
        }
    }

    honorCosts(prompt, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        properties.costHandler(context, prompt);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        const { target, refuseGameAction } = this.getProperties(context, additionalProperties);
        const addDuelEventsHandler = () => {
            let cards = (target as DrawCard[]).filter(card => this.canAffect(card, context));
            if(cards.length === 0) {
                return
            }
            let event = this.createEvent(null, context, additionalProperties);
            this.updateEvent(event, cards, context, additionalProperties);
            events.push(event);
        };
        if(refuseGameAction && refuseGameAction.hasLegalTarget(context, additionalProperties)) {
            context.game.promptWithHandlerMenu(context.player.opponent, {
                activePromptTitle: 'Do you wish to refuse the duel?',
                context: context,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        context.game.addMessage('{0} chooses to refuse the duel and {1}', context.player.opponent, refuseGameAction.getEffectMessage(context));
                        refuseGameAction.addEventsToArray(events, context, additionalProperties);
                    },
                    addDuelEventsHandler
                ]
            });
        } else {
            addDuelEventsHandler();
        }
    }

    addPropertiesToEvent(event, cards, context: AbilityContext, additionalProperties): void {
        let properties = this.getProperties(context, additionalProperties);
        if(!cards) {
            cards = this.getProperties(context, additionalProperties).target;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        event.cards = cards;
        event.context = context;
        event.duelType = properties.type;
        event.challenger = properties.challenger;
        event.duelTarget = properties.target;

        let duel = new Duel(context.game, properties.challenger, cards, properties.type, properties.statistic, context.player);
        event.duel = duel;
    }

    eventHandler(event, additionalProperties): void {
        let context = event.context;
        let cards = event.cards;
        let properties = this.getProperties(context, additionalProperties);
        if(properties.challenger.location !== Locations.PlayArea || cards.every(card => card.location !== Locations.PlayArea)) {
            context.game.addMessage('The duel cannot proceed as at least one participant for each side has to be in play');
            return;
        }
        let duel = event.duel;
        // let duel = new Duel(context.game, properties.challenger, cards, properties.type, properties.statistic, context.player);
        if(properties.challengerEffect) {
            context.game.actions.cardLastingEffect({
                effect: properties.challengerEffect,
                duration: Durations.Custom,
                until: {
                    onDuelFinished: event => event.duel === duel
                }
            }).resolve(properties.challenger, context);
        }
        if(properties.targetEffect) {
            context.game.actions.cardLastingEffect({
                effect: properties.targetEffect,
                duration: Durations.Custom,
                until: {
                    onDuelFinished: event => event.duel === duel
                }                
            }).resolve(properties.target, context);
        }
        context.game.queueStep(new DuelFlow(
            context.game, 
            duel, 
            properties.costHandler ? prompt => this.honorCosts(prompt, event.context, additionalProperties) : null, 
            duel => this.resolveDuel(duel, event.context, additionalProperties)
        ));
    }

    checkEventCondition(event, additionalProperties) {
        return event.cards.some(card => this.canAffect(card, event.context, additionalProperties));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let mockDuel = new Duel(context.game, properties.challenger, [], properties.type, properties.statistic, context.player);
        let gameAction = typeof(properties.gameAction) === 'function' ? properties.gameAction(mockDuel, context) : properties.gameAction;
        return gameAction && gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }
}
