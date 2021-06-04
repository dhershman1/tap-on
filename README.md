# on-tap

Another [tape](https://github.com/substack/tape)/tap output formatter for running tests

## Parameters

- `-s, --stack`: This param will **hide** the stack trace in the fail messages you will still see the **at** however
- `-u, --summarize`: Enables failure summaries at the **END** of your test report, useful if you have a lot of tests!

## Installation

```
npm i -D on-tap
```

## Usage

You can simply pass your tap output into `on-tap` through a pipe or other means

```
tape test/*.js | on-tap

tape test/*.js | on-tap -u -s

node test.js | ./node_modules/on-tap/bin/on-tap -u

on-tap -u < src/test/non-tape.tap
```

## Output

The output was built to look a bit like the [tap-spec](https://github.com/scottcorgan/tap-spec) module but without some dependencies like Lodash.

Here are some examples of the output:

![on-tap-example1](https://user-images.githubusercontent.com/8997380/120854433-2b068a00-c54b-11eb-8886-ed5c2ff0e2b8.png)
![on-tap-example2](https://user-images.githubusercontent.com/8997380/120854441-2cd04d80-c54b-11eb-9125-88619f28761c.png)
![on-tap-example3](https://user-images.githubusercontent.com/8997380/120854444-2e017a80-c54b-11eb-8c51-27e3c9d83205.png)
