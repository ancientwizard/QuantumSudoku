// observer-interface.test.ts

import { describe, expect, test } from '@jest/globals'
import type { iSubject   		    } from 'src/js/interface/iObservable'
import type { iObservedState    } from 'src/js/interface/iObservedState'
import type { iObserver         } from 'src/js/interface/iObserver'

// Membership has it rewards, but we do have limits!
//  A cell only has three units it can be a member of
//  ( row, column, grid ) - minus any overlaping intersections
const limit = 20

class TestObservable implements iSubject, iObserver
{
  // Test introspection
  public  idx = 0
  public  hit = 0
  public  max = false

  // Those peeps looking at me (stop!)
  private observers: TestObservable[] = [];

  includeObserver ( observer: TestObservable )
  {
    // We don't intend to observe ourself in this implementation
    if ( observer == this ) return
    if ( ! this.observers.includes(observer))
      this.observers.push(observer)
    this.max = this.length > limit
  }

  excludeObserver ( observer: TestObservable )
  {
    this.observers = this.observers.filter( obs => obs !== observer )
    this.max = this.length > limit
  }

  notifyObservers ( arg: iObservedState )
  {
    for ( const observer of this.observers )
        observer.update( this, arg );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update ( subject: iSubject, arg: iObservedState ) : void
  {
    this.hit++
  }

  observers_as_array () : TestObservable[]
  {
    return this.observers.filter( () => true )
  }

  get length  () { return this.observers.length; }
}

class MyState implements iObservedState
{
    static TAPPED = new MyState('I-TAPPED-YOU-VIA-NOTIFY')
    private constructor ( readonly value : string ) {}
}

describe( 'interface/observer', () => {

  test('include+exclude+length+notify', () => {

    const s = new TestObservable()

    s.includeObserver(s);
    expect(s.length).toBe(0)

    for ( let c = 1 ; c <= 40 ; c++ )
    {
      const _m = new TestObservable()
      _m.idx = c

      s.notifyObservers( MyState.TAPPED )
      s.includeObserver( _m );
      s.includeObserver( _m ); // No duplicates

      expect(s.length).toBe( c%2 == 0 ? c/2+1 : c/2+0.5)
      expect(s.max).toBe(s.length > limit)

      c % 2 == 0 && s.excludeObserver( _m )

      expect(s.length).toBe( c%2 == 0 ? c/2 : c/2+0.5)
      expect(s.max).toBe(s.length > limit)
    }

    let hits = 1
    s.observers_as_array().reverse().forEach(
      ob => { expect(ob.hit).toBe(hits); hits+=2 })

//  console.log(s,"\nSIZE:", s.length)
  })

})

// vim: expandtab number tabstop=4
// END
