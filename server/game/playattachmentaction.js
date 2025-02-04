const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');
const { Phases, EventNames, Locations, CardTypes } = require('./Constants');
const { GameModes } = require('../GameModes');

class PlayAttachmentAction extends BaseAction {
    constructor(card, ignoreType = false) {
        super(card, [Costs.payTargetDependentFateCost('target', ignoreType)], {
            location: [Locations.PlayArea, Locations.Provinces],
            gameAction: GameActions.attach(context => ({ attachment: context.source, ignoreType: ignoreType, takeControl: context.source.controller !== context.player })),
            cardCondition: (card, context) => context.source.canPlayOn(card)
        });
        this.title = 'Play this attachment';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        const frameworkAllowsAttachmentsDuringDynasty = context.game.gameMode === GameModes.Emerald || context.game.gameMode === GameModes.Obsidian;
        if(!ignoredRequirements.includes('phase') && (context.game.currentPhase === Phases.Dynasty && !frameworkAllowsAttachmentsDuringDynasty)) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, context.playType)) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, context.playType)) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        if(context.target.type === CardTypes.Province && context.target.isFacedown()) {
            context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target.location);
        } else {
            context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
        }
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck: context.player && context.player.conflictDeck && context.player.conflictDeck.first() === context.source,
            onPlayCardSource: context.onPlayCardSource,
            playType: context.playType
        });
        let takeControl = context.source.controller !== context.player;
        context.game.openEventWindow([context.game.actions.attach({ attachment: context.source, takeControl: takeControl }).getEvent(context.target, context), cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAttachmentAction;

