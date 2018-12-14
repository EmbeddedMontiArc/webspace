export {Soutput}

class Soutput {
    public velocity; //Amount<Velocity>
    public xi; //Amount<Length>
    public yi; //Amount<Length>
    public ti; //Amount<Duration>
    public degree; //Amount<Angle>
    public doorStatus: boolean;
    public indicatorStatus: boolean;
    public lightTimerStatus: boolean;
    public triggerStatus: boolean;

    public constructor(velocity, xi, yi, ti, degree, doorStatus: boolean, indicatorStatus: boolean,
            lightTimerStatus: boolean, triggerStatus: boolean){

        this.velocity = velocity;
        this.xi = xi;
        this.yi = yi;
        this.ti = ti;
        this.degree = degree;
        this.doorStatus = doorStatus;
        this.indicatorStatus = indicatorStatus;
        this.lightTimerStatus = lightTimerStatus;
        this.triggerStatus = triggerStatus;
    }
}