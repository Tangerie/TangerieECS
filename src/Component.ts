export type ComponentType = Symbol;

export interface IComponent {
    getComponentType() : ComponentType;
}

export default abstract class Component implements IComponent {
    static readonly ComponentType : ComponentType = Symbol("BaseComponent");

    getComponentType() {
        return Component.ComponentType;
    }
}