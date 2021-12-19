const CARD_UNDER_TEST = 's-c-r-o-l-l';
describe('Spell Scroll Reprint', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-atsuko', 'solemn-scholar', 'isawa-tadaka', 'seppun-ishikawa'],
                    hand: [CARD_UNDER_TEST, CARD_UNDER_TEST, CARD_UNDER_TEST],
                    conflictDiscard: ['embrace-the-void', 'cloak-of-night', 'display-of-power', 'way-of-the-scorpion', 'isawa-tadaka-2', 'all-and-nothing', 'censure']
                },
                player2: {
                }
            });

            this.ishikawa = this.player1.findCardByName('seppun-ishikawa');
            this.atsuko = this.player1.findCardByName('isawa-atsuko');
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.tadaka = this.player1.findCardByName('isawa-tadaka');
            this.scroll1 = this.player1.filterCardsByName(CARD_UNDER_TEST)[0];
            this.scroll2 = this.player1.filterCardsByName(CARD_UNDER_TEST)[1];
            this.scroll3 = this.player1.filterCardsByName(CARD_UNDER_TEST)[2];

            this.etv = this.player1.findCardByName('embrace-the-void');
            this.cloak = this.player1.findCardByName('cloak-of-night');
            this.dop = this.player1.findCardByName('display-of-power');
            this.tadaka2 = this.player1.findCardByName('isawa-tadaka-2');
            this.scorp = this.player1.findCardByName('way-of-the-scorpion');
            this.aan = this.player1.findCardByName('all-and-nothing');
            this.censure = this.player1.findCardByName('censure');
        });

        it('should let you pick a non-character spell card from your discard that matches a trait on attached character, spend 1 fate, move it to hand and discard itself', function () {
            this.player1.playAttachment(this.scroll1, this.atsuko);
            this.player2.pass();
            let fate = this.player1.fate;
            this.player1.clickCard(this.scroll1);
            expect(this.player1).toBeAbleToSelect(this.etv);
            expect(this.player1).not.toBeAbleToSelect(this.cloak);
            expect(this.player1).not.toBeAbleToSelect(this.dop);
            expect(this.player1).not.toBeAbleToSelect(this.scorp);
            expect(this.player1).not.toBeAbleToSelect(this.tadaka2);
            expect(this.player1).toBeAbleToSelect(this.aan);
            expect(this.player1).not.toBeAbleToSelect(this.censure);

            this.player1.clickCard(this.etv);
            expect(this.etv.location).toBe('hand');
            expect(this.player1.fate).toBe(fate - 1);
            expect(this.scroll1.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses S-C-R-O-L-L, spending 1 fate to move Embrace the Void to their hand and sacrifice S-C-R-O-L-L');
        });

        it('should do nothing if there are no legal targets', function () {
            this.player1.playAttachment(this.scroll1, this.tadaka);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.scroll1);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be able to grab Censure', function () {
            this.player1.playAttachment(this.scroll1, this.ishikawa);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.scroll1);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should give +2 pol when participating in a conflict that matches element', function () {
            this.player1.playAttachment(this.scroll1, this.tadaka);
            this.player2.pass();
            this.player1.playAttachment(this.scroll2, this.scholar);
            this.player2.pass();
            this.player1.playAttachment(this.scroll3, this.atsuko);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.tadaka, this.atsuko],
                defenders: [],
                ring: 'earth'
            });

            expect(this.tadaka.getPoliticalSkill()).toBe(this.tadaka.printedPoliticalSkill + 2);
            expect(this.atsuko.getPoliticalSkill()).toBe(this.atsuko.printedPoliticalSkill);
            expect(this.scholar.getPoliticalSkill()).toBe(this.scholar.printedPoliticalSkill);
        });
    });
});
