import TriggeredAbilityContext = require('../TriggeredAbilityContext');
import { GameAction } from './GameAction';
import { AddTokenAction, AddTokenProperties} from './AddTokenAction';
import { AttachAction, AttachActionProperties } from './AttachAction';
import { AttachToRingAction, AttachToRingActionProperties } from './AttachToRingAction';
import { BowAction, BowActionProperties } from './BowAction';
import { BreakAction, BreakProperties } from './BreakAction';
import { CancelAction, CancelActionProperties } from './CancelAction';
import { CardMenuAction, CardMenuProperties } from './CardMenuAction';
import { ChooseGameAction, ChooseActionProperties } from './ChooseGameAction';
import { ChosenDiscardAction, ChosenDiscardProperties } from './ChosenDiscardAction';
import { ChosenReturnToDeckAction, ChosenReturnToDeckProperties } from './ChosenReturnToDeckAction';
import { ClaimRingAction, ClaimRingProperties } from './ClaimRingAction';
import { ConditionalAction, ConditionalActionProperties } from './ConditionalAction';
import { CreateTokenAction, CreateTokenProperties } from './CreateTokenAction';
import { DetachAction, DetachActionProperties } from './DetachAction';
import { DeckSearchAction,  DeckSearchProperties} from './DeckSearchAction';
import { DiscardFavorAction, DiscardFavorProperties } from './DiscardFavorAction';
import { DiscardFromPlayAction, DiscardFromPlayProperties } from './DiscardFromPlayAction';
import { DiscardCardAction, DiscardCardProperties } from './DiscardCardAction';
import { DiscardStatusAction, DiscardStatusProperties } from './DiscardStatusAction';
import { DishonorAction, DishonorProperties } from './DishonorAction';
import { DishonorProvinceAction, DishonorProvinceProperties } from './DishonorProvinceAction';
import { DrawAction, DrawProperties } from './DrawAction';
import { DuelAction, DuelProperties } from './DuelAction';
import { FillProvinceAction, FillProvinceProperties } from './FillProvinceAction';
import { FlipDynastyAction, FlipDynastyProperties } from './FlipDynastyAction';
import { GainFateAction, GainFateProperties } from './GainFateAction';
import { GainHonorAction, GainHonorProperties } from './GainHonorAction';
import { GainStatusTokenAction, GainStatusTokenProperties } from './GainStatusTokenAction';
import { HandlerAction, HandlerProperties } from './HandlerAction';
import { HonorAction, HonorProperties } from './HonorAction';
import { HonorBidAction, HonorBidProperties } from './HonorBidAction';
import { IfAbleAction, IfAbleActionProperties } from './IfAbleAction';
import { InitiateConflictAction, InitiateConflictProperties } from './InitiateConflictAction';
import { JointGameAction } from './JointGameAction';
import { LastingEffectAction, LastingEffectProperties } from './LastingEffectAction';
import { LastingEffectCardAction, LastingEffectCardProperties } from './LastingEffectCardAction';
import { LastingEffectRingAction, LastingEffectRingProperties } from './LastingEffectRingAction';
import { LookAtAction, LookAtProperties } from './LookAtAction';
import { LoseFateProperties, LoseFateAction } from './LoseFateAction';
import { LoseHonorAction, LoseHonorProperties } from './LoseHonorAction';
import { MatchingDiscardAction, MatchingDiscardProperties } from './MatchingDiscardAction';
import { MenuPromptAction, MenuPromptProperties } from './MenuPromptAction';
import { ModifyBidAction, ModifyBidProperties } from './ModifyBidAction';
import { MoveCardAction, MoveCardProperties } from './MoveCardAction';
import { MoveToConflictAction, MoveToConflictProperties } from './MoveToConflictAction';
import { MoveTokenAction, MoveTokenProperties } from './MoveTokenAction';
import { MultipleGameAction } from './MultipleGameAction';
import { MultipleContextGameAction, MultipleContextActionProperties } from './MultipleContextGameAction';
import { PlaceCardUnderneathAction, PlaceCardUnderneathProperties } from './PlaceCardUnderneathAction';
import { PlaceFateAction, PlaceFateProperties } from './PlaceFateAction';
import { PlaceFateAttachmentAction, PlaceFateAttachmentProperties } from './PlaceFateAttachmentAction';
import { PlaceFateRingAction, PlaceFateRingProperties } from './PlaceFateRingAction';
import { PlayCardAction, PlayCardProperties } from './PlayCardAction';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction';
import { PutInProvinceAction, PutInProvinceProperties } from './PutInProvinceAction';
import { OpponentPutIntoPlayAction, OpponentPutIntoPlayProperties } from './OpponentPutIntoPlayAction';
import { RandomDiscardAction, RandomDiscardProperties } from './RandomDiscardAction';
import { ReadyAction, ReadyProperties } from './ReadyAction';
import { RefillFaceupAction, RefillFaceupProperties } from './RefillFaceupAction';
import { RemoveFateAction, RemoveFateProperties } from './RemoveFateAction';
import { RemoveFromGameAction, RemoveFromGameProperties } from './RemoveFromGameAction';
import { ResolveAbilityAction, ResolveAbilityProperties } from './ResolveAbilityAction';
import { RestoreProvinceAction, RestoreProvinceProperties } from './RestoreProvinceAction';
import { ResolveConflictRingAction } from './ResolveConflictRingAction';
import { ResolveElementAction, ResolveElementProperties } from './ResolveElementAction';
import { ReturnRingAction, ReturnRingProperties } from './ReturnRingAction';
import { ReturnToDeckAction, ReturnToDeckProperties } from './ReturnToDeckAction';
import { ReturnToHandAction, ReturnToHandProperties } from './ReturnToHandAction';
import { RevealAction, RevealProperties } from './RevealAction';
import { SelectCardAction, SelectCardProperties } from './SelectCardAction';
import { SelectRingAction, SelectRingProperties } from './SelectRingActions';
import { SelectTokenAction, SelectTokenProperties } from './SelectTokenAction';
import { SendHomeAction, SendHomeProperties } from './SendHomeAction';
import { SequentialAction } from './SequentialAction';
import { SequentialContextAction, SequentialContextProperties } from './SequentialContextAction';
import { SetDialAction, SetDialProperties } from './SetDialAction';
import { ShuffleDeckAction, ShuffleDeckProperties } from './ShuffleDeckAction';
import { SwitchConflictElementAction, SwitchConflictElementProperties } from './SwitchConflictElementAction';
import { SwitchConflictTypeAction, SwitchConflictTypeProperties } from './SwitchConflictTypeAction';
import { TaintAction, TaintProperties } from './TaintAction';
import { TakeControlAction, TakeControlProperties } from './TakeControlAction';
import { TakeFateRingAction, TakeFateRingProperties } from './TakeFateRingAction';
import { TakeRingAction, TakeRingProperties } from './TakeRingAction';
import { TransferFateAction, TransferFateProperties } from './TransferFateAction';
import { TransferHonorAction, TransferHonorProperties } from './TransferHonorAction';
import { TriggerAbilityAction, TriggerAbilityProperties } from './TriggerAbilityAction';
import { TurnCardFacedownAction, TurnCardFacedownProperties } from './TurnCardFacedownAction';
import { GloryCountAction, GloryCountProperties } from './GloryCountAction';
import { ClaimFavorAction, ClaimFavorProperties } from './ClaimFavorAction';
import { RingActionProperties } from './RingAction';
import { MoveConflictAction, MoveConflictProperties } from './MoveConflictAction';
import { RemoveRingFromPlayAction, RemoveRingFromPlayProperties } from './RemoveRingFromPlayAction';
import { ReturnRingToPlayAction, ReturnRingToPlayProperties } from './ReturnRingToPlayAction';
import { FlipFavorAction, FlipFavorProperties } from './FlipFavorAction';

const GameActions = {
    // card
    addToken: (propertyFactory: AddTokenProperties | ((context: TriggeredAbilityContext) => AddTokenProperties) = {}) => new AddTokenAction(propertyFactory),
    attach: (propertyFactory: AttachActionProperties | ((context: TriggeredAbilityContext) => AttachActionProperties) = {}) => new AttachAction(propertyFactory), // attachment
    attachToRing: (propertyFactory: AttachToRingActionProperties | ((context: TriggeredAbilityContext) => AttachToRingActionProperties) = {}) => new AttachToRingAction(propertyFactory), // attachment on a ring
    bow: (propertyFactory: BowActionProperties | ((context: TriggeredAbilityContext) => BowActionProperties) = {}) => new BowAction(propertyFactory),
    break: (propertyFactory: BreakProperties | ((context: TriggeredAbilityContext) => BreakProperties) = {}) => new BreakAction(propertyFactory),
    cardLastingEffect: (propertyFactory: LastingEffectCardProperties | ((context: TriggeredAbilityContext) => LastingEffectCardProperties)) => new LastingEffectCardAction(propertyFactory),
    claimImperialFavor: (propertyFactory: ClaimFavorProperties | ((context: TriggeredAbilityContext) => ClaimFavorProperties)) => new ClaimFavorAction(propertyFactory),
    createToken: (propertyFactory: CreateTokenProperties | ((context: TriggeredAbilityContext) => CreateTokenProperties) = {}) => new CreateTokenAction(propertyFactory),
    detach: (propertyFactory: DetachActionProperties | ((context: TriggeredAbilityContext) => DetachActionProperties) = {}) => new DetachAction(propertyFactory),
    discardCard: (propertyFactory: DiscardCardProperties | ((context: TriggeredAbilityContext) => DiscardCardProperties) = {}) => new DiscardCardAction(propertyFactory),
    discardFromPlay: (propertyFactory: DiscardFromPlayProperties | ((context: TriggeredAbilityContext) => DiscardFromPlayProperties) = {}) => new DiscardFromPlayAction(propertyFactory),
    dishonor: (propertyFactory: DishonorProperties | ((context: TriggeredAbilityContext) => DishonorProperties) = {}) => new DishonorAction(propertyFactory),
    dishonorProvince: (propertyFactory: DishonorProvinceProperties | ((context: TriggeredAbilityContext) => DishonorProvinceProperties) = {}) => new DishonorProvinceAction(propertyFactory),
    duel: (propertyFactory: DuelProperties | ((context: TriggeredAbilityContext) => DuelProperties)) => new DuelAction(propertyFactory), // type, challenger, resolutionHandler, costHandler
    flipDynasty: (propertyFactory: FlipDynastyProperties | ((context: TriggeredAbilityContext) => FlipDynastyProperties) = {}) => new FlipDynastyAction(propertyFactory),
    flipImperialFavor: (propertyFactory: FlipFavorProperties | ((context: TriggeredAbilityContext) => FlipFavorProperties)) => new FlipFavorAction(propertyFactory),
    honor: (propertyFactory: HonorProperties | ((context: TriggeredAbilityContext) => HonorProperties) = {}) => new HonorAction(propertyFactory),
    lookAt: (propertyFactory: LookAtProperties | ((context: TriggeredAbilityContext) => LookAtProperties) = {}) => new LookAtAction(propertyFactory),
    moveCard: (propertyFactory: MoveCardProperties | ((context: TriggeredAbilityContext) => MoveCardProperties)) => new MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false, faceup = false
    moveToConflict: (propertyFactory: MoveToConflictProperties | ((context: TriggeredAbilityContext) => MoveToConflictProperties) = {}) => new MoveToConflictAction(propertyFactory),
    placeFate: (propertyFactory: PlaceFateProperties | ((context: TriggeredAbilityContext) => PlaceFateProperties) = {}) => new PlaceFateAction(propertyFactory), // amount = 1, origin
    placeFateAttachment: (propertyFactory: PlaceFateAttachmentProperties | ((context: TriggeredAbilityContext) => PlaceFateAttachmentProperties) = {}) => new PlaceFateAttachmentAction(propertyFactory), // amount = 1, origin
    playCard: (propertyFactory: PlayCardProperties | ((context: TriggeredAbilityContext) => PlayCardProperties) = {}) => new PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    performGloryCount: (propertyFactory: GloryCountProperties | ((context: TriggeredAbilityContext) => GloryCountProperties)) => new GloryCountAction(propertyFactory),
    putIntoConflict: (propertyFactory: PutIntoPlayProperties | ((context: TriggeredAbilityContext) => PutIntoPlayProperties) = {}) => new PutIntoPlayAction(propertyFactory), // fate = 0, status = ordinary
    putIntoPlay: (propertyFactory: PutIntoPlayProperties | ((context: TriggeredAbilityContext) => PutIntoPlayProperties) = {}) => new PutIntoPlayAction(propertyFactory, false), // fate = 0, status = ordinary
    putIntoProvince: (propertyFactory: PutInProvinceProperties | ((context: TriggeredAbilityContext) => PutInProvinceProperties)) => new PutInProvinceAction(propertyFactory),
    opponentPutIntoPlay: (propertyFactory: OpponentPutIntoPlayProperties | ((context: TriggeredAbilityContext) => OpponentPutIntoPlayProperties) = {}) => new OpponentPutIntoPlayAction(propertyFactory, false), // fate = 0, status = ordinary
    ready: (propertyFactory: ReadyProperties | ((context: TriggeredAbilityContext) => ReadyProperties) = {}) => new ReadyAction(propertyFactory),
    removeFate: (propertyFactory: RemoveFateProperties | ((context: TriggeredAbilityContext) => RemoveFateProperties) = {}) => new RemoveFateAction(propertyFactory), // amount = 1, recipient
    removeFromGame: (propertyFactory: RemoveFromGameProperties | ((context: TriggeredAbilityContext) => RemoveFromGameProperties) = {}) => new RemoveFromGameAction(propertyFactory),
    resolveAbility: (propertyFactory: ResolveAbilityProperties | ((context: TriggeredAbilityContext) => ResolveAbilityProperties)) => new ResolveAbilityAction(propertyFactory), // ability
    restoreProvince: (propertyFactory: RestoreProvinceProperties | ((context: TriggeredAbilityContext) => RestoreProvinceProperties) = {}) => new RestoreProvinceAction(propertyFactory),
    returnToDeck: (propertyFactory: ReturnToDeckProperties | ((context: TriggeredAbilityContext) => ReturnToDeckProperties) = {}) => new ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory: ReturnToHandProperties | ((context: TriggeredAbilityContext) => ReturnToHandProperties) = {}) => new ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory: RevealProperties | ((context: TriggeredAbilityContext) => RevealProperties) = {}) => new RevealAction(propertyFactory), // chatMessage = false
    sendHome: (propertyFactory: SendHomeProperties | ((context: TriggeredAbilityContext) => SendHomeProperties) = {}) => new SendHomeAction(propertyFactory),
    sacrifice: (propertyFactory: DiscardFromPlayProperties | ((context: TriggeredAbilityContext) => DiscardFromPlayProperties) = {}) => new DiscardFromPlayAction(propertyFactory, true),
    taint: (propertyFactory: TaintProperties | ((context: TriggeredAbilityContext) => TaintProperties) = {}) => new TaintAction(propertyFactory),
    takeControl: (propertyFactory: TakeControlProperties | ((context: TriggeredAbilityContext) => TakeControlProperties) = {}) => new TakeControlAction(propertyFactory),
    triggerAbility: (propertyFactory: TriggerAbilityProperties | ((context: TriggeredAbilityContext) => TriggerAbilityProperties)) => new TriggerAbilityAction(propertyFactory), // ability
    turnFacedown: (propertyFactory: TurnCardFacedownProperties | ((context: TriggeredAbilityContext) => TurnCardFacedownProperties) = {}) => new TurnCardFacedownAction(propertyFactory),
    gainStatusToken: (propertyFactory: GainStatusTokenProperties | ((context: TriggeredAbilityContext) => GainStatusTokenProperties) = {}) => new GainStatusTokenAction(propertyFactory),
    moveConflict: (propertyFactory: MoveConflictProperties | ((context: TriggeredAbilityContext) => MoveConflictProperties) = {}) => new MoveConflictAction(propertyFactory),
    placeCardUnderneath: (propertyFactory: PlaceCardUnderneathProperties | ((context: TriggeredAbilityContext) => PlaceCardUnderneathProperties)) => new PlaceCardUnderneathAction(propertyFactory), // destination, hideWhenFaceup = true
    // player actions
    chosenDiscard: (propertyFactory: ChosenDiscardProperties | ((context: TriggeredAbilityContext) => ChosenDiscardProperties) = {}) => new ChosenDiscardAction(propertyFactory), // amount = 1
    chosenReturnToDeck: (propertyFactory: ChosenReturnToDeckProperties | ((context: TriggeredAbilityContext) => ChosenReturnToDeckProperties) = {}) => new ChosenReturnToDeckAction(propertyFactory), // amount = 1
    deckSearch: (propertyFactory: DeckSearchProperties | ((context: TriggeredAbilityContext) => DeckSearchProperties)) => new DeckSearchAction(propertyFactory), // amount = -1, reveal = true, cardCondition = (card, context) => true
    discardAtRandom: (propertyFactory: RandomDiscardProperties | ((context: TriggeredAbilityContext) => RandomDiscardProperties) = {}) => new RandomDiscardAction(propertyFactory), // amount = 1
    discardMatching: (propertyFactory: MatchingDiscardProperties | ((context: TriggeredAbilityContext) => MatchingDiscardProperties) = {}) => new MatchingDiscardAction(propertyFactory), // amount = 1
    draw: (propertyFactory: DrawProperties | ((context: TriggeredAbilityContext) => DrawProperties) = {}) => new DrawAction(propertyFactory), // amount = 1
    fillProvince: (propertyFactory: FillProvinceProperties | ((context: TriggeredAbilityContext) => FillProvinceProperties)) => new FillProvinceAction(propertyFactory), // location, amount = 1, faceup = false
    gainFate: (propertyFactory: GainFateProperties | ((context: TriggeredAbilityContext) => GainFateProperties) = {}) => new GainFateAction(propertyFactory), // amount = 1
    gainHonor: (propertyFactory: GainHonorProperties | ((context: TriggeredAbilityContext) => GainHonorProperties) = {}) => new GainHonorAction(propertyFactory), // amount = 1
    honorBid: (propertyFactory: HonorBidProperties | ((context: TriggeredAbilityContext) => HonorBidProperties) = {}) => new HonorBidAction(propertyFactory), // giveHonor = false, players = Players.Any, prohibitedBids = []
    initiateConflict: (propertyFactory: InitiateConflictProperties | ((context: TriggeredAbilityContext) => InitiateConflictProperties) = {}) => new InitiateConflictAction(propertyFactory), // canPass = true
    loseFate: (propertyFactory: LoseFateProperties | ((context: TriggeredAbilityContext) => LoseFateProperties) = {}) => new LoseFateAction(propertyFactory),
    loseHonor: (propertyFactory: LoseHonorProperties | ((context: TriggeredAbilityContext) => LoseHonorProperties) = {}) => new LoseHonorAction(propertyFactory), // amount = 1
    loseImperialFavor: (propertyFactory: DiscardFavorProperties | ((context: TriggeredAbilityContext) => DiscardFavorProperties) = {}) => new DiscardFavorAction(propertyFactory),
    modifyBid: (propertyFactory: ModifyBidProperties | ((context: TriggeredAbilityContext) => ModifyBidProperties) = {}) => new ModifyBidAction(propertyFactory), // amount = 1, direction = 'increast', promptPlayer = false
    playerLastingEffect: (propertyFactory: LastingEffectProperties | ((context: TriggeredAbilityContext) => LastingEffectProperties) ) => new LastingEffectAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetController, condition, until
    refillFaceup: (propertyFactory: RefillFaceupProperties | ((context: TriggeredAbilityContext) => RefillFaceupProperties)) => new RefillFaceupAction(propertyFactory), // location
    setHonorDial: (propertyFactory: SetDialProperties | ((context: TriggeredAbilityContext) => SetDialProperties)) => new SetDialAction(propertyFactory), // value
    shuffleDeck: (propertyFactory: ShuffleDeckProperties | ((context: TriggeredAbilityContext) => ShuffleDeckProperties)) => new ShuffleDeckAction(propertyFactory),
    takeFate: (propertyFactory: TransferFateProperties | ((context: TriggeredAbilityContext) => TransferFateProperties) = {}) => new TransferFateAction(propertyFactory), // amount = 1
    takeHonor: (propertyFactory: TransferHonorProperties | ((context: TriggeredAbilityContext) => TransferHonorProperties) = {}) => new TransferHonorAction(propertyFactory), // amount = 1
    // ring actions
    placeFateOnRing: (propertyFactory: PlaceFateRingProperties | ((context: TriggeredAbilityContext) => PlaceFateRingProperties) = {}) => new PlaceFateRingAction(propertyFactory), // amount = 1, origin
    resolveConflictRing: (propertyFactory: RingActionProperties | ((context: TriggeredAbilityContext) => RingActionProperties) = {}) => new ResolveConflictRingAction(propertyFactory), // resolveAsAttacker = true
    resolveRingEffect: (propertyFactory: ResolveElementProperties | ((context: TriggeredAbilityContext) => ResolveElementProperties) = {}) => new ResolveElementAction(propertyFactory), // options = false
    returnRing: (propertyFactory: ReturnRingProperties | ((context: TriggeredAbilityContext) => ReturnRingProperties) = {}) => new ReturnRingAction(propertyFactory),
    ringLastingEffect: (propertyFactory: LastingEffectRingProperties | ((context: TriggeredAbilityContext) => LastingEffectRingProperties)) => new LastingEffectRingAction(propertyFactory), // duration = 'untilEndOfConflict', effect, condition, until
    selectRing: (propertyFactory: SelectRingProperties | ((context: TriggeredAbilityContext) => SelectRingProperties)) => new SelectRingAction(propertyFactory),
    switchConflictElement: (propertyFactory: SwitchConflictElementProperties | ((context: TriggeredAbilityContext) => SwitchConflictElementProperties) = {}) => new SwitchConflictElementAction(propertyFactory),
    switchConflictType: (propertyFactory: SwitchConflictTypeProperties | ((context: TriggeredAbilityContext) => SwitchConflictTypeProperties) = {}) => new SwitchConflictTypeAction(propertyFactory),
    takeFateFromRing: (propertyFactory: TakeFateRingProperties | ((context: TriggeredAbilityContext) => TakeFateRingProperties) = {}) => new TakeFateRingAction(propertyFactory), // amount = 1
    takeRing: (propertyFactory: TakeRingProperties | ((context: TriggeredAbilityContext) => TakeRingProperties) = {}) => new TakeRingAction(propertyFactory),
    claimRing: (propertyFactory: ClaimRingProperties | ((context: TriggeredAbilityContext) => ClaimRingProperties) = {}) => new ClaimRingAction(propertyFactory),
    removeRingFromPlay: (propertyFactory: RemoveRingFromPlayProperties | ((context: TriggeredAbilityContext) => RemoveRingFromPlayProperties) = {}) => new RemoveRingFromPlayAction(propertyFactory),
    returnRingToPlay: (propertyFactory: ReturnRingToPlayProperties | ((context: TriggeredAbilityContext) => ReturnRingToPlayProperties) = {}) => new ReturnRingToPlayAction(propertyFactory),
    // status token actions
    discardStatusToken: (propertyFactory: DiscardStatusProperties | ((context: TriggeredAbilityContext) => DiscardStatusProperties) = {}) => new DiscardStatusAction(propertyFactory),
    moveStatusToken: (propertyFactory: MoveTokenProperties | ((context: TriggeredAbilityContext) => MoveTokenProperties)) => new MoveTokenAction(propertyFactory),
    // general actions
    cancel: (propertyFactory: CancelActionProperties | ((context: TriggeredAbilityContext) => CancelActionProperties) = {}) => new CancelAction(propertyFactory),
    handler: (propertyFactory: HandlerProperties | ((context: TriggeredAbilityContext) => HandlerProperties)) => new HandlerAction(propertyFactory),
    noAction: () => new HandlerAction(),
    // conflict actions
    conflictLastingEffect: (propertyFactory: LastingEffectProperties | ((context: TriggeredAbilityContext) => LastingEffectProperties) ) => new LastingEffectAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetController, condition, until

    // meta actions
    cardMenu: (propertyFactory: CardMenuProperties | ((context: TriggeredAbilityContext) => CardMenuProperties)) => new CardMenuAction(propertyFactory),
    chooseAction: (propertyFactory: ChooseActionProperties | ((context: TriggeredAbilityContext) => ChooseActionProperties)) => new ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    conditional: (propertyFactory: ConditionalActionProperties | ((context: TriggeredAbilityContext) => ConditionalActionProperties)) => new ConditionalAction(propertyFactory),
    ifAble: (propertyFactory: IfAbleActionProperties | ((context: TriggeredAbilityContext) => IfAbleActionProperties)) => new IfAbleAction(propertyFactory),
    joint: (gameActions: GameAction[]) => new JointGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    multiple: (gameActions: GameAction[]) => new MultipleGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    multipleContext: (propertyFactory: MultipleContextActionProperties | ((context: TriggeredAbilityContext) => MultipleContextActionProperties)) => new MultipleContextGameAction(propertyFactory),
    menuPrompt: (propertyFactory: MenuPromptProperties | ((context: TriggeredAbilityContext) => MenuPromptProperties)) => new MenuPromptAction(propertyFactory),
    selectCard: (propertyFactory: SelectCardProperties | ((context: TriggeredAbilityContext) => SelectCardProperties)) => new SelectCardAction(propertyFactory),
    selectToken: (propertyFactory: SelectTokenProperties | ((context: TriggeredAbilityContext) => SelectTokenProperties)) => new SelectTokenAction(propertyFactory),
    sequential: (gameActions: GameAction[]) => new SequentialAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequentialContext: (propertyFactory: SequentialContextProperties | ((context: TriggeredAbilityContext) => SequentialContextProperties)) => new SequentialContextAction(propertyFactory)
};

export = GameActions;
