const DrawCard = require('../../drawcard.js');
const _ = require('underscore');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ForceOfTheRiver extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.action({
            title: 'Create spirits from facedown dynasty cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'summon {1}!',
            effectArgs: {
                id: 'spirit-of-the-river',
                label: 'Sprits of the River',
                name: 'Sprits of the River',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: AbilityDsl.actions.createToken(context => ({
                target: _.flatten(context.game.getProvinceArray().map(
                    location => context.player.getDynastyCardsInProvince(location))).filter(
                    card => card.isFacedown())
            }))
        });
    }
}

ForceOfTheRiver.id = 'force-of-the-river';

module.exports = ForceOfTheRiver;
