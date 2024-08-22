// Subject/Publisher Interface
export
interface Subject {
    attachObserver(observer: Observer): void;
    detachObserver(observer: Observer): void;
    notifyObserver(): void;
}

// Observer/Subscriber Interface
export
interface Observer {
    update(subject: Subject): void;
}

// vim: expandtab tabstop=2 number
// END
