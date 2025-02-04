const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');
const { EffectNames, Phases, PlayTypes, EventNames, Players, Locations } = require('./Constants');
const { GameModes } = require('../GameModes');

class PlayCharacterAction extends BaseAction {
    constructor(card, intoConflictOnly = false, intoPlayOnly = false) {
        super(card, [
            Costs.chooseFate(PlayTypes.PlayFromHand),
            Costs.payReduceableFateCost()
        ]);
        this.intoConflictOnly = intoConflictOnly;
        this.intoPlayOnly = intoPlayOnly;
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        const frameworkAllowsConflictCharactersDuringDynasty = context.game.gameMode === GameModes.Emerald || context.game.gameMode === GameModes.Obsidian;
        if(!ignoredRequirements.includes('phase') && (context.game.currentPhase === Phases.Dynasty && !frameworkAllowsConflictCharactersDuringDynasty)) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, PlayTypes.PlayFromHand)) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, PlayTypes.PlayFromHand)) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        if(!context.player.checkRestrictions('playCharacter', context) || !context.player.checkRestrictions('enterPlay', context)) {
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
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck: context.player && context.player.conflictDeck && context.player.conflictDeck.first() === context.source,
            onPlayCardSource: context.onPlayCardSource,
            playType: PlayTypes.PlayFromHand
        });
        let putIntoPlayHandler = () => {
            context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.chooseFate);
            let effect = context.source.getEffects(EffectNames.EntersPlayForOpponent);
            let player = effect.length > 0 ? Players.Opponent : Players.Self;
            context.game.openEventWindow([GameActions.putIntoPlay({ fate: context.chooseFate + extraFate, controller: player, overrideLocation: Locations.Hand }).getEvent(context.source, context), cardPlayedEvent]);
        };
        let putIntoConflictHandler = () => {
            context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.chooseFate);
            context.game.openEventWindow([GameActions.putIntoConflict({ fate: context.chooseFate }).getEvent(context.source, context), cardPlayedEvent]);
        };
        if(context.source.allowGameAction('putIntoConflict', context) && !this.intoPlayOnly) {
            if(this.intoConflictOnly) {
                putIntoConflictHandler();
            } else {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Where do you wish to play this character?',
                    source: context.source,
                    choices: ['Conflict', 'Home'],
                    handlers: [
                        putIntoConflictHandler,
                        putIntoPlayHandler
                    ]
                });
            }
        } else {
            putIntoPlayHandler();
        }
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCharacterAction;

