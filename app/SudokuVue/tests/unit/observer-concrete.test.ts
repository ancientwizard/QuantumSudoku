// observer-concrete.test.ts

import { describe, expect, test } from '@jest/globals'
import { Subject                } from '@/js/model/Observable'
import type { iObservedState    } from '@/js/interface/iObservedState'
import type { iObserver         } from '@/js/interface/iObserver'

// Membership has it rewards, but we do have limits!
//  A cell only has three units it can be a member of
//  ( row, column, grid ) - minus any overlaping intersections
const limit = 20

class TestObservable extends Subject implements iObserver
{
  // Test observability
  public  idx = 0
  public  hit = 0
  public  max = false

  includeObserver ( observer: TestObservable )
  {
    // We don't intend to observe ourself in this implementation
    if ( observer == this ) return
    super.includeObserver( observer )
    this.max = this.length > limit
  }

  excludeObserver ( observer: TestObservable )
  {
    super.excludeObserver( observer )
    this.max = this.length > limit
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update ( subject: Subject, arg: iObservedState ) : void
  {
    this.hit++; // console.log(subject, arg, 'has-hit-me', this)
  }
}

class MyState implements iObservedState
{
    static TAPPED = new MyState('I-TAPPED-YOU-VIA-NOTIFY')
    private constructor ( readonly label : string ) {}
}

describe( 'concrete/observer', () => {

  test('include+exclude+length+notify', () => {

    const s = new TestObservable()

    // No wicked self-observation!
    s.includeObserver(s);
    expect(s.length).toBe(0)

    for ( let c = 1 ; c <= 40 ; c++ )
    {
      const _m = new TestObservable()
      _m.idx = c

      s.notifyObservers( MyState.TAPPED )
      s.includeObserver( _m );
      s.includeObserver( _m ); // No duplicates

      expect(s.length).toBe( c%2 == 0 ? c/2+1 : c/2+0.5) // Proof - no duplicates
      expect(s.max).toBe(s.length > limit)

      c % 2 == 0 && s.excludeObserver( _m )

      expect(s.length).toBe(c%2 == 0 ? c/2 : c/2+0.5)
      expect(s.max).toBe(s.length > limit)
    }

    // The longer the watcher has been in the set the
    //  greater the notifications (HITS)
    let hits = 1
    s.observers_as_array().reverse().forEach(
      ob => { expect((ob as TestObservable).hit).toBe(hits); hits+=2 })

//  console.log(s,"\nSIZE:", s.length)
  })

})

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
