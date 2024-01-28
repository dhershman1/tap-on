# tap-on

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/dhershman1/tap-on.svg?style=flat-square&logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/dhershman1/tap-on/context:javascript)
[![npm](https://img.shields.io/npm/v/tap-on.svg?style=flat-square)](https://www.npmjs.com/package/tap-on)

Another [tape](https://github.com/substack/tape)/tap output formatter for running tests

I built this package primarily to use with tape, and its tap output. The biggest issue with tap is that the way its output is structured can almost be anything.

If you need or want to use tap-on and it comes out ugle, or just flat out doesn't work please open an issue! I will be glad to help!

## Parameters

- `-s, --stack`: This param will **hide** the stack trace in the fail messages you will still see the **at** however
- `-u, --summarize`: Enables failure summaries at the **END** of your test report, useful if you have a lot of tests!
- `--no-color`: Disables colored output, and only keeps the icons, and spacing

## Installation

```
npm i -D tap-on
```

## Usage

You can simply pass your tap output into `tap-on` through a pipe or other means

```
tape test/*.js | tap-on

tape test/*.js | tap-on -u -s

node test.js | ./node_modules/tap-on/bin/tap-on -u

tap-on -u < src/test/non-tape.tap
```

## Output

The output was built to look a bit like the [tap-spec](https://github.com/scottcorgan/tap-spec) module but without some dependencies like Lodash.

The stats at the bottom work like so:

- `Total`: Total number of tests run
- `Passed`: Total passing tests
- `Failed`: Total failing tests
- `Skipped`: Total **SKIPPED** tests (**NOT** skipped assertions)
- `Duration`: Total time took to run

Here are some examples of the output:

![on-tap-example1](https://user-images.githubusercontent.com/8997380/120860729-25617200-c554-11eb-9a72-165598830599.png)
![on-tap-example2](https://user-images.githubusercontent.com/8997380/120860730-25617200-c554-11eb-9e55-7026b416f2c8.png)
![on-tap-example3](https://user-images.githubusercontent.com/8997380/120860727-24c8db80-c554-11eb-85ef-ccff03ab267a.png)
