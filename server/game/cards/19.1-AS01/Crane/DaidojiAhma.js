const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations } = require('../../../Constants');

class DaidojiAhma extends DrawCard {
    cardMatches(card, context) {
        return card.isDishonored && card.controller === context.player && card.location === Locations.PlayArea && card.isFaction('crane');
    }

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.context.ability.isTriggeredAbility() && event.cardTargets.some(card => (
                    this.cardMatches(card, context)
                )),
                onMoveFate: (event, context) => event.context.source.type === 'ring' && this.cardMatches(event.origin, context) && event.fate > 0,
                onCardHonored: (event, context) => event.context.source.type === 'ring' && this.cardMatches(event.card, context),
                onCardDishonored: (event, context) => event.context.source.type === 'ring' && this.cardMatches(event.card, context),
                onCardBowed: (event, context) => event.context.source.type === 'ring' && this.cardMatches(event.card, context),
                onCardReadied: (event, context) => event.context.source.type === 'ring' && this.cardMatches(event.card, context)
            },
            gameAction: AbilityDsl.actions.cancel(),
            effect: 'cancel the effects of {1}{2}',
            effectArgs: context => [
                context.event.context.source.type === 'ring' ? 'the ' : '',
                context.event.context.source
            ]
        });
    }
}

DaidojiAhma.id = 'daidoji-ahma';

module.exports = DaidojiAhma;
