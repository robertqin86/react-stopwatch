/* @flow */

import { PureComponent } from 'react';
import { fillTextWithFormat } from './utils';
import type { Props, State } from './types';

class ReactStopWatch extends PureComponent<Props, State> {
  static displayName = 'ReactStopWatch';

  static defaultProps = {
    withLoop: false,
    onCallback: () => {},
  };

  intervalId: IntervalID;

  constructor(props: Props): void {
    super(props);

    const {
      hours,
      minutes,
      seconds,
    } = props;

    const formatted: string = fillTextWithFormat(hours, minutes, seconds);

    this.intervalId = setInterval(() => {}, Number.MAX_VALUE);
    this.state = {
      formatted,
      stateHours: hours,
      stateMinutes: minutes,
      stateSeconds: seconds,
    };
  }

  componentWillReceiveProps(): void {
    this.intervalId = setInterval(() => {}, Number.MAX_VALUE);
    this.setState({
      stateHours: 0,
      stateMinutes: 0,
      stateSeconds: 0,
    });
  }

  componentDidMount(): void {
    this.timer();
  }

  componentWillUnmount(): void {
    this.stopToCount();
  }

  stopToCount() {
    clearInterval(this.intervalId);
  }

  counter(): void {
    const {
      limit,
      withLoop,
      onCallback,
    } = this.props;

    const {
      stateHours,
      stateMinutes,
      stateSeconds,
    } = this.state;

    this.setState(prevState => ({
      stateSeconds: prevState.stateSeconds + 1,
    }));

    if (stateSeconds >= 59) {
      this.setState(prevState => ({
        stateSeconds: 0,
        stateMinutes: prevState.stateMinutes + 1,
      }));

      if (stateMinutes >= 59) {
        this.setState(prevState => ({
          stateMinutes: 0,
          stateHours: prevState.stateHours + 1,
        }));
      }
    }

    const formatted: string = fillTextWithFormat(stateHours, stateMinutes, stateSeconds);

    this.setState({ formatted });

    if (limit === formatted) {
      setTimeout(() => {
        this.stopToCount();
        if (withLoop) {
          this.timer();
        }
        onCallback();
      }, 0);
    }
  }

  timer(): void {
    const intervalId: IntervalID = setInterval(() => {
      this.counter();
    }, 1000);

    this.intervalId = intervalId;
  }


  render() {
    const { children, render } = this.props;

    const {
      formatted,
      stateHours: hours,
      stateMinutes: minutes,
      stateSeconds: seconds,
    } = this.state;

    if (children) {
      return children({
        formatted,
        hours,
        minutes,
        seconds,
      });
    }

    if (render) {
      return render({
        formatted,
        hours,
        minutes,
        seconds,
      });
    }

    // eslint-disable-next-line
    console.error(
      'Component ReactStopWatch:',
      'no children or render prop are present',
    );

    return null;
  }
}

export default ReactStopWatch;
