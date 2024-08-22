
export
class MySubject implements Subject
{
    private numberOfProducts = 0;
    private observers: Observer[] = [];

    attachObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    detachObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObserver(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    // Other methods and state management...
}

// vim: expandtab tabstop=4 number
// END
