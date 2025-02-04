describe('There Are No Secrets', function() {
    integration(function() {
        describe('Embrace the Void/Karmic Twist interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['miya-mystic', 'seppun-guardsman'],
                        hand: ['there-are-no-secrets', 'karmic-twist']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.miyaMystic.fate = 2;
                this.embraceTheVoid = this.player1.playAttachment('there-are-no-secrets', this.miyaMystic);
                this.player2.pass();
                this.karmicTwist = this.player1.clickCard('karmic-twist');
            });

            it('should not cancel the effect, and then give the player 1 fate', function() {
                expect(this.player1).toHavePrompt('Karmic Twist');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePrompt('Karmic Twist');
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                this.player1.clickCard(this.embraceTheVoid);
                expect(this.player1.fate).toBe(1);
                expect(this.miyaMystic.fate).toBe(0);
                expect(this.seppunGuardsman.fate).toBe(2);
                expect(this.karmicTwist.location).toBe('conflict discard pile');
                expect(this.getChatLogs(5)).toContain('player1 uses There Are No Secrets to gain 1 fate');
            });
        });

        describe('Embrace the Void/Feast or Famine interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['prodigy-of-the-waves'],
                        hand: ['there-are-no-secrets']
                    },
                    player2: {
                        provinces: ['feast-or-famine'],
                        inPlay: ['adept-of-the-waves']
                    }
                });
                this.prodigyOfTheWaves = this.player1.findCardByName('prodigy-of-the-waves');
                this.prodigyOfTheWaves.fate = 2;
                this.embraceTheVoid = this.player1.findCardByName('there-are-no-secrets');

                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.feastOrFamine = this.player2.findCardByName('feast-or-famine');

                this.player1.playAttachment(this.embraceTheVoid, this.prodigyOfTheWaves);
                this.player2.pass();
                this.player1.pass();
                this.initiateConflict({
                    attackers: [this.prodigyOfTheWaves],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
            });

            it('should gain a fate', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.feastOrFamine);
                this.player2.clickCard(this.feastOrFamine);
                expect(this.player2).toHavePrompt('Feast or Famine');
                expect(this.player2).toBeAbleToSelect(this.prodigyOfTheWaves);
                this.player2.clickCard(this.prodigyOfTheWaves);
                expect(this.player2).toHavePrompt('Feast or Famine');
                expect(this.player2).toBeAbleToSelect(this.adeptOfTheWaves);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                this.player1.clickCard(this.embraceTheVoid);
                expect(this.player1.fate).toBe(2);
                expect(this.prodigyOfTheWaves.fate).toBe(1);
                expect(this.adeptOfTheWaves.fate).toBe(1);
            });
        });

        describe('Embrace the Void/Assassination interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:1,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['there-are-no-secrets']
                    },
                    player2: {
                        hand: ['assassination']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.adeptOfTheWaves.fate = 3;
                this.embraceTheVoid = this.player1.playAttachment('there-are-no-secrets', this.adeptOfTheWaves);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: []
                });
            });

            it('should give Embrace the Void\'s controller all fate when the character is assassinated', function() {
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                this.player1.clickCard(this.embraceTheVoid);
                expect(this.player1.fate).toBe(2);
                expect(this.adeptOfTheWaves.location).toBe('dynasty discard pile');
                expect(this.embraceTheVoid.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Embrace the Void/A Legion of One interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:1,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['a-legion-of-one']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['there-are-no-secrets']
                    }
                });
                this.legion = this.player1.findCardByName('a-legion-of-one');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.adept.fate = 2;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adept],
                    defenders: []
                });
            });

            it('should give Embrace the Void\'s controller the fate but still let A Legion Of One trigger a second time', function() {
                this.milStat = this.adept.getMilitarySkill();
                this.polStat = this.adept.getMilitarySkill();
                this.fateStat = this.adept.fate;
                this.player2Fate = this.player2.fate;
                this.player2.playAttachment('there-are-no-secrets', this.adept);
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.adept);
                this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('there-are-no-secrets');
                this.player2.clickCard('there-are-no-secrets');
                expect(this.adept.fate).toBe(this.fateStat - 1);
                expect(this.player2.fate).toBe(this.player2Fate + 1);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.adept);
                this.player1.clickCard(this.adept);
                this.player1.clickPrompt('Done');
                expect(this.adept.getMilitarySkill()).toBe(this.milStat + 6);
                expect(this.adept.getPoliticalSkill()).toBe(this.polStat);
            });
        });

        describe('Embrace the Void/I Am Ready interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:1,
                        inPlay: ['wandering-ronin', 'shinjo-outrider'],
                        hand: ['i-am-ready']
                    },
                    player2: {
                        fate: 1,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['there-are-no-secrets']
                    }
                });
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.shinjo = this.player1.findCardByName('shinjo-outrider');
                this.shinjo.fate = 2;
                this.ronin.fate = 2;
                this.shinjo.bowed = true;
                this.game.checkGameState(true);
                this.player1.pass();
                this.embrace = this.player2.playAttachment('there-are-no-secrets', this.shinjo);
            });

            it('should not cancel the effects of the event', function() {
                this.fateStat = this.shinjo.fate;
                this.player1.clickCard('i-am-ready');
                this.player1.clickCard(this.shinjo);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('there-are-no-secrets');
                this.player2.clickCard('there-are-no-secrets');
                expect(this.shinjo.bowed).toBe(false);
                expect(this.shinjo.fate).toBe(this.fateStat - 1);
                expect(this.player2.fate).toBe(2);
            });
        });

        describe('Limit/Max Test', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['iuchi-wayfinder', 'moto-chagatai'],
                        hand: ['there-are-no-secrets', 'there-are-no-secrets', 'i-am-ready', 'i-am-ready', 'i-am-ready', 'i-am-ready', 'i-am-ready']
                    }
                });
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.chagatai = this.player1.findCardByName('moto-chagatai');
                this.wayfinder.fate = 3;
                this.chagatai.fate = 2;
                this.secrets1 = this.player1.filterCardsByName('there-are-no-secrets')[0];
                this.secrets2 = this.player1.filterCardsByName('there-are-no-secrets')[1];
                this.ready1 = this.player1.filterCardsByName('i-am-ready')[0];
                this.ready2 = this.player1.filterCardsByName('i-am-ready')[1];
                this.ready3 = this.player1.filterCardsByName('i-am-ready')[2];
                this.ready4 = this.player1.filterCardsByName('i-am-ready')[3];
                this.ready5 = this.player1.filterCardsByName('i-am-ready')[4];

                this.wayfinder.bow();
                this.chagatai.bow();
                this.player1.playAttachment(this.secrets1, this.wayfinder);
                this.player2.pass();
                this.player1.playAttachment(this.secrets2, this.chagatai);
                this.player2.pass();
            });

            it('each should work twice, up to 3 total among all copies', function() {
                let fate = this.player1.fate;
                this.player1.clickCard(this.ready1);
                this.player1.clickCard(this.wayfinder);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.secrets1);
                this.player1.clickCard(this.secrets1);
                expect(this.player1.fate).toBe(fate + 1);
                this.wayfinder.bow();
                this.player2.pass();

                this.player1.clickCard(this.ready2);
                this.player1.clickCard(this.wayfinder);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.secrets1);
                this.player1.clickCard(this.secrets1);
                expect(this.player1.fate).toBe(fate + 2);
                this.wayfinder.bow();
                this.player2.pass();

                this.player1.clickCard(this.ready3);
                this.player1.clickCard(this.wayfinder);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player2.pass();

                this.player1.clickCard(this.ready4);
                this.player1.clickCard(this.chagatai);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.secrets2);
                this.player1.clickCard(this.secrets2);
                expect(this.player1.fate).toBe(fate + 3);
                this.chagatai.bow();
                this.player2.pass();

                this.player1.clickCard(this.ready5);
                this.player1.clickCard(this.chagatai);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
