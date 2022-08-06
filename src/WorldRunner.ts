import World from "./World";


export type EventFn<T extends World> = (world : T) => void;

export enum EventType {
    Init,
    Resume,
    Pause,
    Preupdate,
    Postupdate,
    Finish
}

export default class WorldRunner<T extends World> {
    readonly world : T;

    private previous_time : number = performance.now();

    private eventHandlers = new Map<EventType, EventFn<T>[]>();

    private animationHandle : number = -1;

    private _paused : boolean = true;
    private _hasRun : boolean = false;

    constructor(world : T) {
        this.world = world;
    }

    private loop(current_time : number) {
        const delta = (current_time - this.previous_time) * 0.001;

        this.runEvents(EventType.Preupdate);

        this.world.Update(delta);

        this.runEvents(EventType.Postupdate);

        this.previous_time = current_time;

        this.requestFrame();
    }

    private requestFrame() {
        return this.animationHandle = window.requestAnimationFrame(this.loop.bind(this));
    }

    private runEvents(type : EventType) {
        this.eventHandlers.get(type)?.forEach(fn => fn(this.world));
    }

    addEvent(type : EventType, fn : EventFn<T>) {
        if(!this.eventHandlers.get(type)) this.eventHandlers.set(type, []);
        this.eventHandlers.get(type)?.push(fn);
        return this;
    }


    Start() {
        if(this._hasRun) {
            this.runEvents(EventType.Resume);
        } else {
            this.runEvents(EventType.Init);
            this._hasRun = true;
        }

        if(this._paused) {
            this._paused = false;
            this.requestFrame();
        }
        return this;
    }

    Pause() {
        if(!this._paused) {
            this._paused = true;
            window.cancelAnimationFrame(this.animationHandle);
            this.animationHandle = -1;
            this.runEvents(EventType.Pause);
        }
        return this;
    }

    get paused() {
        return this._paused;
    }
}