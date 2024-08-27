import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import AnimatedRectangle from './classes/AnimatedRectangle.js';

import audio from "../audio/rectangles-no-8.ogg";
import midi from "../audio/rectangles-no-8.mid";

/**
 * Blobs No. 2
 */
const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[4].notes.filter(note => note.midi !== 43); // Redrum - roland tr-808 (kit01)
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    const noteSet2 = result.tracks[2].notes; // Subtrator - Raison d'etre
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    const noteSet3 = result.tracks[9].notes; // Subtrator - Vibra
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    const noteSet4 = result.tracks[5].notes; // Europa - Night Driver
                    p.scheduleCueSet(noteSet4, 'executeCueSet4');
                    const noteSet5 = result.tracks[6].notes; // Europa - Impact Square
                    p.scheduleCueSet(noteSet5, 'executeCueSet5');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.gridCells = [];

        p.bgRect = null;

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.colorMode(p.HSB);
            p.rectMode(p.CENTER);
            p.background(0, 0, 0, 0.5);
            p.strokeWeight(5);
            let maxX = 16;
            let maxY = 8;
            p.horizontalGrid = true;
            p.cellSize = p.height / 9;
            if(p.height > p.width) {
                p.horizontalGrid = false; 
                p.cellSize = p.width / 9;
                maxX = 8;
                maxY = 16;
            } 

            for (let x = 0; x < maxX; x++) {
                for (let y = 0; y < maxY; y++) {
                    p.gridCells.push(
                        {
                            x: x * p.cellSize,
                            y: y * p.cellSize,
                            size: p.cellSize * 0.9,
                            pattern: undefined
                        }
                    )
                }
            }

            p.translateX = (p.width - (maxX * p.cellSize)) / 2 + (p.cellSize / 2);
            p.translateY = (p.height - (maxY * p.cellSize)) / 2 + (p.cellSize / 2);
            p.translate(p.translateX, p.translateY);

            // p.snake = new AnimatedRectangle(
            //     p,
            //     p.width / 2,
            //     p.height / 2
            // )
        }

        p.draw = () => {
            p.background(0, 0, 0);
            // p.snake.update();
		    // p.snake.draw();
            
		    // if (p.snake.dead) {
            //     p.snake = new AnimatedRectangle(p, p.snake.x, p.snake.y);
            // }
            p.translate(p.translateX, p.translateY);

            

            if(p.bgRect) {
                const { width, height, hue } = p.bgRect;
                const x = p.width / 2 - p.translateX;
                const y = p.height / 2 - p.translateY;
                p.stroke(hue, 100, 100);
                p.fill(hue, 100, 100, 0.2);
                p.rect(x, y, width, height);
                p.fill(hue, 100, 100, 0.4);
                p.rect(x, y, width / 2, height / 2);
                p.fill(hue, 100, 100, 0.6);
                p.rect(x, y, width / 4, height / 4);
                p.bgRect.width = p.bgRect.width + 8;
                p.bgRect.height = p.bgRect.height + 8;
            }

            p.stroke(0, 0, 0);

            for (let i = 0; i < p.gridCells.length; i++) {
                const cell = p.gridCells[i];
                const { x, y, size, pattern } = cell;
                if(pattern === undefined) {
                    p.stroke(0, 0, 100);
                    p.fill(0, 0, 100);
                } 
                else {
                    pattern.update();
                    pattern.draw();
                    
                    // if (hue.dead) {
                    //     hue = new AnimatedRectangle(p, hue.x, hue.y, hue.size, hue.hue);
                    // }
                }
                p.rect(x, y, size, size);
            }
            p.translate(-p.translateX, -p.translateY);
        }

        p.executeCueSet1 = (note) => {
            const { currentCue } = note; 
            if(currentCue % 29 === 1 && currentCue < 120) {
                p.gridCells.forEach(cell => {
                    cell.pattern = undefined;
                });
            }
        }

        // Subtrator - Raison d'etre
        p.executeCueSet2 = (note) => {
            const emptyCells = p.gridCells.filter(cell => cell.pattern === undefined);
            const randomCell = p.random(emptyCells);
            randomCell.pattern = new AnimatedRectangle(
                p,
                randomCell.x - (randomCell.size / 2),
                randomCell.y - (randomCell.size / 2),
                randomCell.size,
                60
            );
        }

        // Subtrator - Vibra
        p.executeCueSet3 = (note) => {
            const emptyCells = p.gridCells.filter(cell => cell.pattern === undefined);
            const randomCell = p.random(emptyCells);
            randomCell.pattern = new AnimatedRectangle(
                p,
                randomCell.x - (randomCell.size / 2),
                randomCell.y - (randomCell.size / 2),
                randomCell.size,
                200
            );
        }

        // Europa - Night Driver
        p.executeCueSet4 = (note) => {
            const emptyCells = p.gridCells.filter(cell => cell.pattern === undefined);
            const randomCell = p.random(emptyCells);
            randomCell.pattern = new AnimatedRectangle(
                p,
                randomCell.x - (randomCell.size / 2),
                randomCell.y - (randomCell.size / 2),
                randomCell.size,
                100
            );
        }

        // Europa - Impact Square
        p.executeCueSet5 = (note) => {
            const { durationTicks } = note;
            console.log(durationTicks);
            const emptyCells = p.gridCells.filter(cell => cell.pattern === undefined);
            const randomCell = p.random(emptyCells);
            randomCell.pattern = new AnimatedRectangle(
                p,
                randomCell.x - (randomCell.size / 2),
                randomCell.y - (randomCell.size / 2),
                randomCell.size,
                320
            );
            if(durationTicks > 19000) {
                p.bgRect = {
                    width: p.width / 1000,
                    height: p.height / 1000,
                    hue: 160
                }
            }
        }

        p.hasStarted = false;

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                        if (typeof window.dataLayer !== typeof undefined){
                            window.dataLayer.push(
                                { 
                                    'event': 'play-animation',
                                    'animation': {
                                        'title': document.title,
                                        'location': window.location.href,
                                        'action': 'replaying'
                                    }
                                }
                            );
                        }
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                    if (typeof window.dataLayer !== typeof undefined && !p.hasStarted){
                        window.dataLayer.push(
                            { 
                                'event': 'play-animation',
                                'animation': {
                                    'title': document.title,
                                    'location': window.location.href,
                                    'action': 'start playing'
                                }
                            }
                        );
                        p.hasStarted = false
                    }
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
