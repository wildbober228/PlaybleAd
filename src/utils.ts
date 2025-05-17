import GameObject = Phaser.GameObjects.GameObject;
import Container = Phaser.GameObjects.Container;
import {Position} from "./managers/game-object-factory/constants.ts";

export interface Size {
    width: number;
    height: number;
}

export const isPortrait = (): boolean => document.documentElement.clientWidth < document.documentElement.clientHeight;

export const correctOrientation = (w: number, h: number): Size => {
    if (!isPortrait()) {
        return {width: Math.max(w, h), height: Math.min(w, h),};
    }
    return {width: Math.min(w, h), height: Math.max(w, h),};
};

const getParentContainers = (child: GameObject, containers: Container[] = []): Container[] => {
    if (child.parentContainer) {
        containers.push(child.parentContainer);
        getParentContainers(child.parentContainer, containers);
    }
    return containers;
};
export const getCssElementPositionByClassName = (className: string, origin: Position = {
    x: 1 / 2,
    y: 1 / 2
}): Position | undefined => {
    const elements = document.getElementsByClassName(className);
    if (elements.length === 0) {
        return;
    }
    const element = elements[0] as HTMLElement;
    const rect = element.getBoundingClientRect();
    return {x: rect.left + rect.width * origin.x, y: rect.top + rect.height * origin.y,};
};
export const translatePositionCssToPhaser = (cssElementPosition: Position, container: Container): Position => {
    const parentContainers = getParentContainers(container).reverse();
    const {width} = container.scene.game.scale;
    const canvasSize = correctOrientation(document.documentElement.clientWidth, document.documentElement.clientHeight);
    const gameScale = canvasSize.width / width;
    let y = cssElementPosition.y / gameScale;
    let x = cssElementPosition.x / gameScale;
    parentContainers.forEach((container: Container) => {
        y = (y - container.y) / container.scale;
        x = (x - container.x) / container.scale;
    });
    return {x, y,};
};