export {Sinput}

class Sinput {
    public acceleration; //Amount<Acceleration> 
    public steering; //Amount<Angle>
    public x0; //Amount<Length>
    public y0; //Amount<Length> 
    public t0; //Amount<Duration>
    public doorStatus: boolean;
    public indicatorStatus: boolean;
    public lightTimerStatus: boolean;
    public triggerStatus: boolean;

    public constructor(acceleration, steering, x0, y0, t0, doorStatus: boolean, indicatorStatus: boolean,
            lightTimerStatus: boolean, triggerStatus: boolean){

        this.acceleration = acceleration;
        this.steering = steering;
        this.x0 = x0;
        this.y0 = y0;
        this.t0 = t0;
        this.doorStatus = doorStatus;
        this.indicatorStatus = indicatorStatus;
        this.lightTimerStatus = lightTimerStatus;
        this.triggerStatus = triggerStatus;
    }
}