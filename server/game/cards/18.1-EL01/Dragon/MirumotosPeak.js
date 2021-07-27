const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class MirumotosPeak extends StrongholdCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.hasTrait('courtier') && card.isHonored,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(1)
        });

        this.reaction({
            title: 'Honor a character',
            when: {
                onCardHonored: (event, context) => event.card.controller === context.player && event.card !== context.source
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.hasTrait('courtier'),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

MirumotosPeak.id = 'miruomoto-s-peak';

module.exports = MirumotosPeak;
