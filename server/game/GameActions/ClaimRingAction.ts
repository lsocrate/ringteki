import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames, ConflictTypes} from '../Constants';

export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean,
    type?: string,
}

export class ClaimRingAction extends RingAction {
    name = 'claimRing';
    eventName = EventNames.OnClaimRing;
    effect = 'claim {0}';
    defaultProperties: ClaimRingProperties = { takeFate: true, type: ConflictTypes.Military };
    constructor(properties: ((context: AbilityContext) => ClaimRingProperties) | ClaimRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        if(!context.player.checkRestrictions('claimRings', context)) {
            return false;
        }
        
        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event, additionalProperties): void {
        let { takeFate, type } = this.getProperties(event.context, additionalProperties) as ClaimRingProperties;
        let ring = event.ring;
        let context = event.context;
        ring.contested = false;
        ring.conflictType = type;
        if(takeFate && ring.fate > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
            let fate = ring.fate;
            context.player.modifyFate(ring.fate);
            ring.removeFate();
            context.game.raiseEvent(EventNames.OnMoveFate, { fate: fate, origin: ring, context: context, recipient: context.player });
        }
        event.player = context.player;
        event.conflict = context.conflict;
        event.ring = ring;
        ring.claimRing(context.player);
    }
}

