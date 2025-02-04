const _ = require('underscore');
const ReduceableFateCost = require('./costs/ReduceableFateCost');
const TargetDependentFateCost = require('./costs/TargetDependentFateCost');
const GameActions = require('./GameActions/GameActions');
const GameActionCost = require('./costs/GameActionCost');
const MetaActionCost = require('./costs/MetaActionCost');
const Event = require('./Events/Event');
const { EventNames, Locations, Players, TargetModes, PlayTypes, CharacterStatus } = require('./Constants');

function getSelectCost(action, properties, activePromptTitle) {
    return new MetaActionCost(GameActions.selectCard(Object.assign({ gameAction: action }, properties)), activePromptTitle);
}

const Costs = {
    /**
     * Cost that will bow the card that initiated the ability.
     */
    bowSelf: () => new GameActionCost(GameActions.bow()),
    /**
     * Cost that will bow the card that the card that initiated the ability is attached to.
     */
    bowParent: () => new GameActionCost(GameActions.bow(context => ({ target: context.source.parent }))),
    /**
     * Cost that requires bowing a card that matches the passed condition
     * predicate function.
     */
    bow: properties => getSelectCost(GameActions.bow(), properties, 'Select card to bow'),
    /**
     * Cost that will move home the card that initiated the ability.
     */
    moveHomeSelf: () => new GameActionCost(GameActions.sendHome(context => ({target: context.source}))),
    /**
     * Cost that will send the target to the conflict.
     */
    moveToConflict: properties => getSelectCost(GameActions.moveToConflict(), properties, 'Select card to move to the conflict'),
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: () => new GameActionCost(GameActions.sacrifice()),
    /**
     * Cost that will sacrifice a specified card.
     */
    sacrificeSpecific: cardFunc => new GameActionCost(GameActions.sacrifice(context => ({ target: cardFunc(context) }))),
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: properties => getSelectCost(GameActions.sacrifice(), properties, 'Select card to sacrifice'),
    /**
     * Cost that will return a selected card to hand which matches the passed
     * condition.
     */
    returnToHand: properties => getSelectCost(GameActions.returnToHand(), properties, 'Select card to return to hand'),
    /**
     * Cost that will return a selected card to the appropriate deck which matches the passed
     * condition.
     */
    returnToDeck: properties => getSelectCost(GameActions.returnToDeck(properties), properties, 'Select card to return to your deck'),
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: () => new GameActionCost(GameActions.returnToHand()),
    /**
     * Cost that will shuffle a selected card into the relevant deck which matches the passed
     * condition.
     */
    shuffleIntoDeck: properties => getSelectCost(
        GameActions.moveCard({ destination: Locations.DynastyDeck, shuffle: true }),
        properties,
        'Select card to shuffle into deck'
    ),
    /**
     * Cost that requires discarding a specific card.
     */
    discardCardSpecific: cardFunc => new GameActionCost(GameActions.discardCard(context => ({ target: cardFunc(context) }))),
    /**
     * Cost that requires discarding itself from hand.
     */
    discardSelf: () => new GameActionCost(GameActions.discardCard(context => ({ target: context.source }))),
    /**
     * Cost that requires discarding a card to be selected by the player.
     */
    discardCard: properties => getSelectCost(GameActions.discardCard(), Object.assign({ location: Locations.Hand, mode: TargetModes.Exactly }, properties),
        properties && properties.numCards && properties.numCards > 1 ? `Select ${properties.numCards} cards to discard` : 'Select card to discard'),
    /**
     * Cost that will discard a fate from the card
     */
    removeFateFromSelf: () => new GameActionCost(GameActions.removeFate()),
    /**
     * Cost that will discard a fate from a selected card
     */
    removeFate: properties => getSelectCost(GameActions.removeFate(), properties, 'Select character to discard a fate from'),
    /**
     * Cost that will discard a fate from the card's parent
     */
    removeFateFromParent: () => new GameActionCost(GameActions.removeFate(context => ({ target: context.source.parent }))),
    /**
    * Cost that requires removing a card selected by the player from the game.
    */
    removeFromGame: properties => getSelectCost(GameActions.removeFromGame(), properties, 'Select card to remove from game'),
    /**
    * Cost that requires removing a card selected by the player from the game.
    */
    removeSelfFromGame: properties => new GameActionCost(GameActions.removeFromGame(properties)),
    /**
     * Cost that will dishonor the character that initiated the ability
     */
    dishonorSelf: () => new GameActionCost(GameActions.dishonor()),
    /**
     * Cost that requires dishonoring a card to be selected by the player
     */
    dishonor: properties => getSelectCost(GameActions.dishonor(), properties, 'Select character to dishonor'),
    /**
     * Cost that will discard the status token on a card to be selected by the player
     */
    /**
     * Cost that requires tainting a card to be selected by the player
    */
    taint: properties => getSelectCost(GameActions.taint(), properties, 'Select card to taint'),
    /**
     * Cost that requires tainting yourself
    */
    taintSelf: () => new GameActionCost(GameActions.taint()),

    discardStatusToken: properties => new MetaActionCost(
        GameActions.selectCard(
            Object.assign({ gameAction: GameActions.discardStatusToken(), subActionProperties: card => ({ target: card.getStatusToken(CharacterStatus.Honored) }) }, properties)
        ),
        'Select character to discard honored status token from'
    ),
    /**
     * Cost that will discard the status token on a card to be selected by the player
     */
    discardStatusTokenFromSelf: () => new GameActionCost(GameActions.discardStatusToken()),
    /**
     * Cost that will break the province that initiated the ability
     */
    breakSelf: () => new GameActionCost(GameActions.break()),
    /**
     * Cost that requires breaking a province selected by the player
     */
    breakProvince: properties => getSelectCost(GameActions.break(), properties, 'Select a province to break'),
    /**
     * Cost that will put into play the card that initiated the ability
     */
    putSelfIntoPlay: () => new GameActionCost(GameActions.putIntoPlay()),
    /**
     * Cost that will prompt for a card
     */
    selectedReveal: properties => getSelectCost(GameActions.reveal(), properties, `Select a ${properties.cardType || 'card'} to reveal`),
    /**
     * Cost that will reveal specific cards
     */
    reveal: (cardFunc) => new GameActionCost(GameActions.reveal(context => ({ target: cardFunc(context) }))),
    /**
     * Cost that discards the Imperial Favor
     */
    discardImperialFavor: () => new GameActionCost(GameActions.loseImperialFavor(context => ({ target: context.player }))),
    /**
     * Cost that will pay the exact printed fate cost for the card.
     */
    payPrintedFateCost: function () {
        return {
            canPay: function (context) {
                let amount = context.source.getCost();
                return context.player.fate >= amount && (amount === 0 || context.player.checkRestrictions('spendFate', context));
            },
            payEvent: function (context) {
                const amount = context.source.getCost();
                return new Event(EventNames.OnSpendFate, { amount, context }, event => event.context.player.fate -= event.amount);
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that will pay the printed fate cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableFateCost: (ignoreType = false) => new ReduceableFateCost(ignoreType),
    /**
     * Cost that is dependent on context.targets[targetName]
     */
    payTargetDependentFateCost: (targetName, ignoreType = false) => new TargetDependentFateCost(targetName, ignoreType),
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of fate.
     */
    payFate: (amount = 1) => new GameActionCost(GameActions.loseFate(context => ({ target: context.player, amount }))),
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of honor.
     */
    payHonor: (amount = 1) => new GameActionCost(GameActions.loseHonor(context => ({ target: context.player, amount }))),
    giveHonorToOpponent: (amount = 1) => new GameActionCost(GameActions.takeHonor(context => ({ target: context.player, amount }))),
    /**
     * Cost where a character must spend fate to an unclaimed ring
     */
    payFateToRing: (amount = 1, ringCondition = ring => ring.isUnclaimed()) => new MetaActionCost(GameActions.selectRing({
        ringCondition,
        gameAction: GameActions.placeFateOnRing(context => ({ amount, origin: context.player }))
    }), 'Select a ring to place fate on'),
    giveFateToOpponent: (amount = 1) => new GameActionCost(GameActions.takeFate(context => ({ target: context.player, amount }))),
    variableHonorCost: function (amountFunc) {
        return {
            canPay: function (context) {
                return amountFunc(context) > 0 && context.game.actions.loseHonor().canAffect(context.player, context);
            },
            resolve: function (context, result) {
                let amount = amountFunc(context);
                let max = Math.min(amount, context.player.honor);
                let choices = Array.from(Array(max), (x, i) => String(i + 1));
                if(result.canCancel) {
                    choices.push('Cancel');
                }
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose how much honor to pay',
                    context: context,
                    choices: choices,
                    choiceHandler: choice => {
                        if(choice === 'Cancel') {
                            context.costs.variableHonorCost = 0;
                            result.cancelled = true;
                        } else {
                            context.costs.variableHonorCost = parseInt(choice);
                        }
                    }
                });
            },
            payEvent: function (context) {
                let action = context.game.actions.loseHonor({ amount: context.costs.variableHonorCost });
                return action.getEvent(context.player, context);
            },
            promptsPlayer: true
        };
    },
    variableFateCost: function (properties = {}) {
        return {
            canPay: function (context) {
                if(context.ignoreFateCost) {
                    return true;
                }
                let minAmount = properties.minAmount ? (_.isFunction(properties.minAmont) ? properties.minAmont(context) : properties.minAmount) : 1;
                let costModifiers = context.player.getTotalCostModifiers(PlayTypes.PlayFromHand, context.source);
                return costModifiers < 0 || (context.player.fate >= minAmount + costModifiers && context.game.actions.loseFate().canAffect(context.player, context));
            },
            resolve: function (context, result) {
                let maxAmount = properties.maxAmount ? (_.isFunction(properties.maxAmount) ? properties.maxAmount(context) : properties.maxAmount) : -1;
                let minAmount = properties.minAmount ? (_.isFunction(properties.minAmont) ? properties.minAmont(context) : properties.minAmount) : 1;
                let costModifiers = context.player.getTotalCostModifiers(PlayTypes.PlayFromHand, context.source);

                if(context.ignoreFateCost) {
                    costModifiers = -1000;
                }

                let max = context.player.fate - costModifiers;
                let min = minAmount;
                if(maxAmount >= 0) {
                    max = Math.min(maxAmount, context.player.fate - costModifiers);
                }
                if(!context.game.actions.loseFate().canAffect(context.player, context)) {
                    max = Math.min(max, -costModifiers);
                }
                let choices = Array.from(Array((max + 1) - min), (x, i) => String(i + min));
                if(result.canCancel) {
                    choices.push('Cancel');
                }
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: properties.activePromptTitle ? properties.activePromptTitle : 'Choose how much fate to pay',
                    context: context,
                    choices: choices,
                    choiceHandler: choice => {
                        if(choice === 'Cancel') {
                            context.costs.variableFateCost = 0;
                            result.cancelled = true;
                        } else {
                            context.costs.variableFateCost = Math.max(0, parseInt(choice));
                        }
                    }
                });
            },
            payEvent: function (context) {
                if(context.ignoreFateCost) {
                    let action = context.game.actions.handler(); //this is a do-nothing event to allow you to pay 0 fate if it's a legal amount
                    return action.getEvent(context.player, context);
                }

                let costModifiers = context.player.getTotalCostModifiers(PlayTypes.PlayFromHand, context.source);
                let cost = context.costs.variableFateCost + Math.min(0, costModifiers); //+ve cost modifiers are applied by the engine
                if(cost > 0) {
                    let action = context.game.actions.loseFate({ amount: cost });
                    return action.getEvent(context.player, context);
                }

                let action = context.game.actions.handler(); //this is a do-nothing event to allow you to pay 0 fate if it's a legal amount
                return action.getEvent(context.player, context);

            },
            promptsPlayer: true
        };
    },
    returnRings: function (amount = -1, ringCondition = (ring, context) => true) { // eslint-disable-line no-unused-vars
        return {
            canPay: function (context) {
                return Object.values(context.game.rings).some(ring => ringCondition(ring, context) && ring.claimedBy === context.player.name);
            },
            getActionName(context) { // eslint-disable-line no-unused-vars
                return 'returnRing';
            },
            getCostMessage: (context) => ['returning the {1}', [context.costs.returnRing]],
            resolve: function (context, result) {
                let chosenRings = [];
                let promptPlayer = () => {
                    let buttons = [];
                    if(chosenRings.length > 0) {
                        buttons.push({ text: 'Done', arg: 'done' });
                    }
                    if(result.canCancel) {
                        buttons.push({ text: 'Cancel', arg: 'cancel' });
                    }
                    context.game.promptForRingSelect(context.player, {
                        activePromptTitle: 'Choose a ring to return',
                        context: context,
                        buttons: buttons,
                        ringCondition: ring => ringCondition(ring, context) && ring.claimedBy === context.player.name && !chosenRings.includes(ring),
                        onSelect: (player, ring) => {
                            chosenRings.push(ring);
                            if(Object.values(context.game.rings).some(ring => ring.claimedBy === context.player.name && !chosenRings.includes(ring) && (amount < 0 || chosenRings.length < amount))) {
                                promptPlayer();
                            } else {
                                context.costs.returnRing = chosenRings;
                            }
                            return true;
                        },
                        onMenuCommand: (player, arg) => {
                            if(arg === 'done') {
                                context.costs.returnRing = chosenRings;
                                return true;
                            }
                        },
                        onCancel: () => {
                            context.costs.returnRing = [];
                            result.cancelled = true;
                        }
                    });
                };
                promptPlayer();
            },
            payEvent: context => context.game.actions.returnRing({ target: context.costs.returnRing }).getEventArray(context),
            promptsPlayer: true
        };
    },
    chooseFate: function (type) {
        return {
            canPay: function () {
                return true;
            },
            resolve: function (context, result) {
                let extrafate = context.player.fate - context.player.getReducedCost(type, context.source);
                if(!context.player.checkRestrictions('placeFateWhenPlayingCharacter', context)) {
                    extrafate = 0;
                }
                if(!context.player.checkRestrictions('placeFateWhenPlayingCharacterFromProvince', context) && type === PlayTypes.PlayFromProvince) {
                    extrafate = 0;
                }
                if(!context.player.checkRestrictions('spendFate', context)) {
                    extrafate = 0;
                }
                let choices = [];
                let max = 3;
                context.chooseFate = 0;
                for(let i = 0; i <= Math.min(extrafate, max); i++) {
                    choices.push(i);
                }
                let handlers = _.map(choices, fate => {
                    return () => context.chooseFate += fate;
                });

                if(extrafate > max) {
                    choices[3] = 'More';
                    handlers[3] = () => {
                        max += 3;
                        context.chooseFate += 3;
                        let zip = _.zip(choices, handlers);
                        zip = _.filter(zip, array => {
                            let choice = array[0];
                            if(choice === 'Cancel') {
                                return true;
                            } else if(choice === 'More') {
                                return extrafate >= max;
                            }
                            return extrafate >= choice + 3;
                        });
                        [choices, handlers] = _.unzip(_.map(zip, array => {
                            let [choice, handler] = array;
                            if(_.isNumber(choice)) {
                                return [choice + 3, handler];
                            }
                            return [choice, handler];
                        }));
                        context.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Choose additional fate',
                            waitingPromptTitle: 'Waiting for opponent to take an action or pass',
                            source: context.source,
                            choices: _.map(choices, choice => _.isString(choice) ? choice : choice.toString()),
                            handlers: handlers
                        });
                    };
                }
                if(result.canCancel) {
                    choices.push('Cancel');
                    handlers.push(() => {
                        result.cancelled = true;
                    });
                }

                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose additional fate',
                    waitingPromptTitle: 'Waiting for opponent to take an action or pass',
                    source: context.source,
                    choices: _.map(choices, choice => _.isString(choice) ? choice : choice.toString()),
                    handlers: handlers
                });
            },
            pay: function (context) {
                context.player.fate -= context.chooseFate;
            },
            promptsPlayer: true
        };
    },

    discardCardsUpToVariableX: function (amountFunc) {
        return {
            canPay: function (context) {
                return amountFunc(context) > 0 && context.game.actions.chosenDiscard().canAffect(context.player, context);
            },
            resolve: function (context, result) {
                let amount = amountFunc(context);
                let max = Math.min(amount, context.player.hand.size());
                context.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose up to ' + max + ' card' + (amount === 1 ? '' : ('s')) + ' to discard',
                    context: context,
                    mode: TargetModes.UpTo,
                    numCards: amount,
                    ordered: false,
                    location: Locations.Hand,
                    controller: Players.Self,
                    onSelect: (player, cards) => {
                        if(cards.length === 0) {
                            context.costs.discardCardsUpToVariableX = [];
                            result.cancelled = true;
                        } else {
                            context.costs.discardCardsUpToVariableX = cards;
                        }
                        return true;
                    },
                    onCancel: () => {
                        result.cancelled = true;
                        return true;
                    }
                });
            },
            payEvent: function (context) {
                let action = context.game.actions.discardCard({ target: context.costs.discardCardsUpToVariableX });
                return action.getEvent(context.costs.discardCardsUpToVariableX, context);
            },
            promptsPlayer: true
        };
    },

    discardCardsExactlyVariableX: function (amountFunc) {
        return {
            canPay: function (context) {
                return amountFunc(context) > 0 && context.game.actions.chosenDiscard().canAffect(context.player, context);
            },
            resolve: function (context, result) {
                let amount = amountFunc(context);
                context.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose ' + amount + ' card' + (amount === 1 ? '' : ('s')) + ' to discard',
                    context: context,
                    mode: TargetModes.Exactly,
                    numCards: amount,
                    ordered: false,
                    location: Locations.Hand,
                    controller: Players.Self,
                    onSelect: (player, cards) => {
                        if(cards.length === 0) {
                            context.costs.discardCardsExactlyVariableX = [];
                            result.cancelled = true;
                        } else {
                            context.costs.discardCardsExactlyVariableX = cards;
                        }
                        return true;
                    },
                    onCancel: () => {
                        result.cancelled = true;
                        return true;
                    }
                });
            },
            payEvent: function (context) {
                let action = context.game.actions.discardCard({ target: context.costs.discardCardsExactlyVariableX });
                return action.getEvent(context.costs.discardCardsExactlyVariableX, context);
            },
            promptsPlayer: true
        };
    },
    discardHand: function () {
        return {
            canPay: function (context) {
                return context.game.actions.chosenDiscard().canAffect(context.player, context);
            },
            resolve: function (context, result) { // eslint-disable-line no-unused-vars
                context.costs.discardHand = context.player.hand.value();
            },
            payEvent: function (context) {
                let action = context.game.actions.discardCard({ target: context.costs.discardHand });
                return action.getEvent(context.costs.discardHand, context);
            },
            promptsPlayer: true
        };
    },
    optionalFateCost: function (amount) {
        return {
            canPay: function () {
                return true;
            },
            getActionName(context) { // eslint-disable-line no-unused-vars
                return 'optionalFateCost';
            },
            getCostMessage: (context) => {
                if(context.costs.optionalFateCost === 0) {
                    return undefined;
                }
                return ['paying {1} fate', [amount]];
            },
            resolve: function (context, result) {
                let fateAvailable = true;
                if(context.player.fate < amount) {
                    fateAvailable = false;
                }
                if(!context.player.checkRestrictions('spendFate', context)) {
                    fateAvailable = false;
                }
                let choices = [];
                let handlers = [];
                context.costs.optionalFateCost = 0;

                if(fateAvailable) {
                    choices = ['Yes', 'No'];
                    handlers = [() => context.costs.optionalFateCost = amount, () => context.costs.optionalFateCost = 0];
                }
                if(fateAvailable && result.canCancel) {
                    choices.push('Cancel');
                    handlers.push(() => {
                        result.cancelled = true;
                    });
                }

                if(choices.length > 0) {
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Spend ' + amount + ' fate?',
                        source: context.source,
                        choices:  choices,
                        handlers: handlers
                    });
                }
            },
            pay: function (context) {
                context.player.fate -= context.costs.optionalFateCost;
            },
            promptsPlayer: true
        };
    },
    optionalGiveFateCost: function (amount) {
        return {
            canPay: function () {
                return true;
            },
            resolve: function (context, result) {
                let fateAvailable = true;
                if(context.player.fate < amount) {
                    fateAvailable = false;
                }
                if(!context.player.checkRestrictions('spendFate', context)) {
                    fateAvailable = false;
                }
                if(!context.player.opponent || !context.player.opponent.checkRestrictions('gainFate', context)) {
                    fateAvailable = false;
                }
                let choices = [];
                let handlers = [];
                context.costs.optionalFateCost = 0;

                if(fateAvailable) {
                    choices = ['Yes', 'No'];
                    handlers = [() => context.costs.optionalFateCost = amount, () => context.costs.optionalFateCost = 0];
                }
                if(fateAvailable && result.canCancel) {
                    choices.push('Cancel');
                    handlers.push(() => {
                        result.cancelled = true;
                    });
                }

                if(choices.length > 0) {
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Give your opponent ' + amount + ' fate?',
                        source: context.source,
                        choices:  choices,
                        handlers: handlers
                    });
                }
            },
            pay: function (context) {
                context.player.fate -= context.costs.optionalFateCost;
                if(context.player.opponent) {
                    context.player.opponent.fate += context.costs.optionalFateCost;
                }
            },
            promptsPlayer: true
        };
    },

    optionalHonorTransferFromOpponentCost: function (canPayFunc = (context) => true) { // eslint-disable-line no-unused-vars
        return {
            canPay: function () {
                return true;
            },
            resolve: function (context, result) { // eslint-disable-line no-unused-vars
                context.costs.optionalHonorTransferFromOpponentCostPaid = false;

                if(!canPayFunc(context)) {
                    return;
                }

                if(!context.player.opponent) {
                    return;
                }

                let honorAvailable = true;
                if(!context.game.actions.loseHonor().canAffect(context.player.opponent, context) || !context.game.actions.gainHonor().canAffect(context.player, context)) {
                    honorAvailable = false;
                }

                if(honorAvailable) {
                    context.game.promptWithHandlerMenu(context.player.opponent, {
                        activePromptTitle: 'Give an honor to your opponent?',
                        source: context.source,
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => context.costs.optionalHonorTransferFromOpponentCostPaid = true,
                            () => context.costs.optionalHonorTransferFromOpponentCostPaid = false
                        ]
                    });
                }
            },
            payEvent: function (context) {
                if(context.costs.optionalHonorTransferFromOpponentCostPaid) {
                    let events = [];

                    context.game.addMessage('{0} chooses to give {1} 1 honor', context.player.opponent, context.player);
                    let honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
                    events.push(honorAction.getEvent(context.player.opponent, context));

                    return events;
                }

                let action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
                return action.getEvent(context.player, context);

            },
            promptsPlayer: true
        };
    },

    nameCard: function() {
        return {
            selectCardName(player, cardName, context) {
                context.costs.nameCardCost = cardName;
                return true;
            },
            getActionName(context) { // eslint-disable-line no-unused-vars
                return 'nameCard';
            },
            getCostMessage: (context) => ['naming {1}', [context.costs.nameCardCost]],
            canPay: function() {
                return true;
            },
            resolve: function(context) {
                let dummyObject = {
                    selectCardName: (player, cardName, context) => {
                        context.costs.nameCardCost = cardName;
                        return true;
                    }
                };

                context.game.promptWithMenu(context.player, dummyObject, {
                    context: context,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                });
            },
            pay: function () {
            }
        };
    }
};

module.exports = Costs;
