const BaseAction = require('./BaseAction.js');
const ReduceableFateCost = require('./costs/ReduceableFateCost');

const { CardTypes, EventNames, Phases, Players, EffectNames } = require ('./Constants');
const { GameModes } = require('../GameModes.js');

const ChooseDisguisedCharacterCost = function(intoConflictOnly) {
    return {
        canPay: context => context.player.cardsInPlay.some(card =>
            context.source.canDisguise(card, context, intoConflictOnly)
        ),
        resolve: (context, results) => context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a character to replace',
            cardType: CardTypes.Character,
            controller: Players.Self,
            cardCondition: card => context.source.canDisguise(card, context, intoConflictOnly),
            context: context,
            onSelect: (player, card) => {
                context.costs.chooseDisguisedCharacter = card;
                return true;
            },
            onCancel: () => {
                results.cancelled = true;
                return true;
            }
        }),
        pay: () => true
    };
};

class DisguisedReduceableFateCost extends ReduceableFateCost {
    constructor(intoConflictOnly) {
        super();
        this.intoConflictOnly = intoConflictOnly;
    }

    canPay(context) {
        const maxCharacterCost = Math.max(...context.player.cardsInPlay.map(card =>
            context.source.canDisguise(card, context) ? card.getCost() : 0
        ));
        const minCost = Math.max(context.player.getMinimumCost(context.playType, context) - maxCharacterCost, 0);
        return context.player.fate >= minCost &&
            (minCost === 0 || context.player.checkRestrictions('spendFate', context));
    }

    getReducedCost(context) {
        if(context.costs.chooseDisguisedCharacter) {
            return Math.max(super.getReducedCost(context) - context.costs.chooseDisguisedCharacter.getCost(), 0);
        }
        return super.getReducedCost(context);
    }
}

class PlayDisguisedCharacterAction extends BaseAction {
    constructor(card, intoConflictOnly = false, intoPlayOnly = false) {
        super(card, [
            ChooseDisguisedCharacterCost(intoConflictOnly),
            new DisguisedReduceableFateCost(intoConflictOnly)
        ]);
        this.intoConflictOnly = intoConflictOnly;
        this.intoPlayOnly = intoPlayOnly;
        this.title = 'Play this character with Disguise';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== Phases.Conflict) {
            return 'phase';
        } else if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, context.playType)) {
            return 'location';
        } else if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, context.playType)) {
            return 'cannotTrigger';
        } else if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        } else if(!context.player.checkRestrictions('enterPlay', context)) {
            return 'restriction';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        let extraFate = context.source.sumEffects(EffectNames.GainExtraFateWhenPlayed);
        let legendaryFate = context.source.sumEffects(EffectNames.LegendaryFate);
        if(!context.source.checkRestrictions('placeFate', context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const status = context.source.getEffects(EffectNames.EntersPlayWithStatus)[0] || '';
        const events = [context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck: context.player && context.player.conflictDeck && context.player.conflictDeck.first() === context.source,
            onPlayCardSource: context.onPlayCardSource,
            playType: context.playType
        })];
        const replacedCharacter = context.costs.chooseDisguisedCharacter;
        if(!replacedCharacter) {
            return;
        }
        const frameworkKeepsDisguisedInCurrentLocation = context.game.gameMode === GameModes.Emerald || context.game.gameMode === GameModes.Obsidian;
        const conflictOnly = this.intoConflictOnly || (frameworkKeepsDisguisedInCurrentLocation && replacedCharacter.isParticipating());

        let intoConflict = conflictOnly && !this.intoPlayOnly;
        if(replacedCharacter.inConflict && !conflictOnly) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => intoConflict = true,
                    () => true
                ]
            });
        }
        context.game.queueSimpleStep(() => {
            context.game.addMessage('{0} plays {1}{2} using Disguised, choosing to replace {3}', context.player, context.source, intoConflict ? ' into the conflict' : '', replacedCharacter);
            const gameAction = intoConflict ? context.game.actions.putIntoConflict({ target: context.source, fate: extraFate, status }) : context.game.actions.putIntoPlay({ target: context.source, fate: extraFate, status });
            gameAction.addEventsToArray(events, context);
            events.push(context.game.getEvent(EventNames.Unnamed, {}, () => {
                const moveEvents = [];
                context.game.actions.placeFate({ target: context.source, origin: replacedCharacter, amount: replacedCharacter.fate }).addEventsToArray(moveEvents, context);
                for(const attachment of replacedCharacter.attachments.toArray()) {
                    context.game.actions.attach({ target: context.source, attachment: attachment, viaDisguised: true }).addEventsToArray(moveEvents, context);
                }
                for(const token of replacedCharacter.statusTokens) {
                    context.game.actions.moveStatusToken({ target: token, recipient: context.source }).addEventsToArray(moveEvents, context);
                }
                moveEvents.push(context.game.getEvent(EventNames.Unnamed, {}, () => {
                    context.game.checkGameState(true);
                    context.game.openThenEventWindow(context.game.actions.discardFromPlay({ cannotBeCancelled: true }).getEvent(replacedCharacter, context));
                }));
                context.game.openThenEventWindow(moveEvents);
            }));
            context.game.openEventWindow(events);
        });
    }

    isCardPlayed() {
        return true;
    }

    isKeywordAbility() {
        return true;
    }
}

module.exports = PlayDisguisedCharacterAction;
