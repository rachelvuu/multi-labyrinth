
import { Area } from './Area';

export interface Moveable {
    currentLocation : Area;

    getLocation(): Area;
    changeArea(area : Area): void;
}   