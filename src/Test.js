import React, { Component } from 'react';
const ms = require('pretty-ms')

class Test extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      time: 0,
      isOn: false,
      begun: false,
      start: 0,
      remainder: 57600000,
      seconds: 57600000,
      clock: new Date(),
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.breakTimes = this.breakTimes.bind(this)
  }

  componentDidMount() {

    //updates the clock
    setInterval(this.update, 1000)
    //checks the time for breaks
    setInterval(this.breakTimes, 1000)
  }

 //function that updates the clock
  update = () => {
    this.setState({
      clock: new Date()
    })

  };

  //pulls out the hour, minutes, and seconds and checks if they're equivalent to a certain time to stop/start the timer
  breakTimes() {
    const h = this.state.clock.getHours()
		const m = this.state.clock.getMinutes()
		const s = this.state.clock.getSeconds()

    //this is the part that sets the breaks
    if( this.state.begun){
      if((h == 14 || 8 ) && m == 0 && s == 0){
        this.stopTimer();
        //starts clock back up again after a period of time (15 minutes in milliseconds) has passed
        setTimeout(this.startTimer, 900000);
      }
      //this part sets the lunch break
      else if (h == 11 && m == 0 && s == 0){
        this.stopTimer();
        //starts clock back up again after a period of time (30 minutes) has passed
        setTimeout(this.startTimer, 1800000);
      }
      //this part stops the clock for the end of the day, and then starts up in the morning
      else if (h == 15 && m == 25 && s == 0) {
        this.stopTimer();
        setTimeout(this.startTimer, 49200000);
      }
    }
  }
  startTimer() {
    this.setState({
      isOn: true,
      begun: true,
      time: this.state.time,
      start: (Date.now() - this.state.time)
    })
    this.timer = setInterval(() => this.setState({
      time: (Date.now() - this.state.start),
      remainder: this.state.seconds - this.state.time,
    }), 1);
  }

  stopTimer() {
    this.setState({isOn: false})
    clearInterval(this.timer)
  }

  resetTimer() {
    this.setState({time: 0, remainder:57600000, isOn: false, begun: false})
  }

  render() {
    const h = this.state.clock.getHours()
		const m = this.state.clock.getMinutes()
		const s = this.state.clock.getSeconds()

    let start = (this.state.time == 0) ?
      <button onClick={this.startTimer}>start</button> :
      null
    let stop = (this.state.time == 0 || !this.state.isOn) ?
      null :
      <button onClick={this.stopTimer}>stop</button>
    let resume = (this.state.time == 0 || this.state.isOn) ?
      null :
      <button onClick={this.startTimer}>resume</button>
    let reset = (this.state.time == 0 || this.state.isOn) ?
      null :
      <button onClick={this.resetTimer}>reset</button>

    return(
      <div>
        <h1>The time is:</h1>
        <h1>{((h % 12) == 0) ? '12' : (h % 12) }:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)} {h < 12 ? 'am' : 'pm'}</h1>
        <h2>Takt Timer: {ms(this.state.remainder , {secDecimalDigits: 0})}   </h2>
        {start}
        {resume}
        {stop}
        {reset}


      </div>
    )
  }
}

export default Test
