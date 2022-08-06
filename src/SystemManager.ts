import ISystem from "./System";
import World from "./World";


export default class SystemManager {
    private systems : Set<ISystem> = new Set();

    private world : World;

    constructor(world : World) {
        this.world = world;
    }

    addSystem(sys : ISystem) {
        this.systems.add(sys);

        return this;
    }

    private runSystem(sys : ISystem) {
        const arch = sys.getArchetype();
        const matches = this.world.components.getFromArchetype(arch);
        if(sys.prerun) sys.prerun(this.world);

        if(sys.runAll) {
            sys.runAll(this.world, matches);
        }
        
        if(sys.run) {
            for(const m of matches) {
                sys.run(this.world, ...m);
            }
        }

        if(sys.postrun) sys.postrun(this.world);
    }

    run() {
        for(const s of this.systems) {
            this.runSystem(s);
        }
    }
}