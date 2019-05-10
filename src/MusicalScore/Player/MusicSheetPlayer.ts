import {Cursor} from "../../OpenSheetMusicDisplay";
import {GraphicalMusicSheet} from "../Graphical/GraphicalMusicSheet";


export class MusicSheetPlayer {
    get IsPlay(): boolean {
        return this.isPlay;
    }
    constructor(bpm: number, musicSheet: GraphicalMusicSheet, cursor: Cursor, playCallback: (noteValues: number[], channel: number) => void) {
        this.bpm = bpm;
        this.musicSheet = musicSheet;
        this.cursor = cursor;
        this.playCallback = playCallback;
    }

    private playCallback: (noteValues: number[], channel: number) => void;
    public musicSheet: GraphicalMusicSheet;
    public bpm: number = 80;
    public cursor: Cursor;
    private isPlay: boolean = false;
    public pauseTime: number = 0;
    public pauseWaitTime: number = 0;
    public startTime: number = 0;
    public currentTimestamp: number = 0;
    public currentMeasureTimestamp: number = 0;

    public startPlay(): void {
        this.isPlay = true;
        if (this.pauseTime !== 0) {
            this.pauseWaitTime += (new Date().getTime() - this.pauseTime);
        } else {
            this.startTime = new Date().getTime();
        }

        this.loop(0, this);
    }

    public stopPlay(): void {
        this.pauseTime = new Date().getTime();
        this.isPlay = false;
    }


    public loop(delay: number, instance: MusicSheetPlayer): void {
        const thisPtr: MusicSheetPlayer = instance;
        //每个cursor为一个循环
        setTimeout(function (): void {
            if (thisPtr.isPlay) {
                const ct: number = new Date().getTime();
                thisPtr.cursor.next();
                thisPtr.playCallback(thisPtr.cursor.CurrentVoiceKey, 0);
                const nextRealValue: number = thisPtr.cursor.Iterator.nextVoiceEntryTimeStemp();
                console.log("nextRealValue-->" + nextRealValue);
                console.log(thisPtr.cursor.Iterator);
                thisPtr.currentTimestamp = nextRealValue;
                delay = ( thisPtr.currentTimestamp) * 4 * (60000 / thisPtr.bpm);
                console.log("delay-->" + delay);
                const offset: number = new Date().getTime() - thisPtr.startTime - thisPtr.pauseWaitTime;
                console.log("offset-->" + offset);
                thisPtr.loop(delay - offset, instance);
                console.log("执行时间-->" + (new Date().getTime() - ct));
            }
        },         delay);

        //等待音符的CurrentSourceTimestamp的时间到下一个指针
    }
}
