import { ComponentType, IComponent } from "./Component";
import World from "./World";

export type SystemArchetype = ComponentType[];

export default interface ISystem<T extends IComponent[] = IComponent[]> {
    getArchetype() : SystemArchetype;
    prerun?(world : World) : void;
    postrun?(world : World) : void;
    run?(world? : World, ...components : T) : void;
    runAll?(world: World, components : T[]) : void;
}