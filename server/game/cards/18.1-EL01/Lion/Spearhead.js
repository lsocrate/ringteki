const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class Spearhead extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent && card.parent.controller === context.player
            }),
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

Spearhead.id = 'spearhead';

module.exports = Spearhead;
