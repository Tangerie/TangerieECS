import { IComponent } from "./Component";
import { Entity } from "./Entity";
import World, { IWorld } from "./World";

export type EntityFactory<T extends World> = (entity : Entity, world : T) => void;