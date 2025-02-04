const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Durations, CardTypes } = require('../../../Constants.js');

class LongJourneyHome extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character for the phase',
            when: {
                onSendHome: (event, context) => this._longJourneyCondition(event, context),
                onReturnHome: (event, context) => this._longJourneyCondition(event, context)
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.bow((context) => ({ target: context.event.card })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Durations.UntilEndOfPhase,
                    target: context.event.card,
                    effect: AbilityDsl.effects.cardCannot({ cannot: 'ready' })
                }))
            ]),
            effect: 'make {1} take the long way home. {1} is bowed and cannot ready until the end of the phase',
            effectArgs: (context) => [context.event.card]
        });
    }

    _longJourneyCondition(event, context) {
        return event.card.type === CardTypes.Character && event.card.controller === context.source.controller.opponent;
    }
}

LongJourneyHome.id = 'long-journey-home';

module.exports = LongJourneyHome;
