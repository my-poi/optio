// Copyright (c) 2010 Michael Stum, http://stum.de/ <= Thanks!

export class TimeSpan {
  msecPerDay = 86400000;
  msecPerHour = 3600000;
  msecPerMinute = 60000;
  msecPerSecond = 1000;
  msecs = 0;

  constructor(days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number) {
    if (days) this.msecs += (days * this.msecPerDay);
    if (hours) this.msecs += (hours * this.msecPerHour);
    if (minutes) this.msecs += (minutes * this.msecPerMinute);
    if (seconds) this.msecs += (seconds * this.msecPerSecond);
    if (milliseconds) this.msecs += milliseconds;
  }

  addDays(days: number) {
    this.msecs += (days * this.msecPerDay);
  }

  addHours(hours: number) {
    this.msecs += (hours * this.msecPerHour);
  }

  addMinutes(minutes: number) {
    this.msecs += (minutes * this.msecPerMinute);
  }

  addSeconds(seconds: number) {
    this.msecs += (seconds * this.msecPerSecond);
  }

  addMilliseconds(milliseconds: number) {
    this.msecs += milliseconds;
  }

  subtractDays(days: number) {
    this.msecs -= (days * this.msecPerDay);
  }

  subtractHours(hours: number) {
    this.msecs -= (hours * this.msecPerHour);
  }

  subtractMinutes(minutes: number) {
    this.msecs -= (minutes * this.msecPerMinute);
  }

  subtractSeconds(seconds: number) {
    this.msecs -= (seconds * this.msecPerSecond);
  }

  subtractMilliseconds(milliseconds: number) {
    this.msecs -= milliseconds;
  }

  add(otherTimeSpan: TimeSpan) {
    this.msecs += otherTimeSpan.totalMilliseconds();
  }

  subtract(otherTimeSpan: TimeSpan) {
    this.msecs -= otherTimeSpan.totalMilliseconds();
  }

  equals(otherTimeSpan: TimeSpan) {
    return this.msecs === otherTimeSpan.totalMilliseconds();
  }

  totalDays() {
    return Math.floor(this.msecs / this.msecPerDay);
  }

  totalHours() {
    return Math.floor(this.msecs / this.msecPerHour);
  }

  totalMinutes() {
    return Math.floor(this.msecs / this.msecPerMinute);
  }

  totalSeconds() {
    return Math.floor(this.msecs / this.msecPerSecond);
  }

  totalMilliseconds() {
    return Math.floor(this.msecs);
  }

  days() {
    return Math.floor(this.msecs / this.msecPerDay);
  }

  hours() {
    return Math.floor(this.msecs / this.msecPerHour) % 24;
  }

  minutes() {
    return Math.floor(this.msecs / this.msecPerMinute) % 60;
  }

  seconds() {
    return Math.floor(this.msecs / this.msecPerSecond) % 60;
  }

  milliseconds() {
    return this.msecs % 1000;
  }
}
