# CSP tool

This is a tool for simplifying generating csp header for your project from csp reports

## Table of Contents
- [How To](#how-to)
- [Directives](#directives)
- [Rules](#rules)
- [License](#license)
# How To
First of all you must create [directives](#directives) from CSP report logs (like in ./test-data.json) then you can use them for creating [csp header](#rules) content

# Directives
Is JSON object like:
```json
{
    "default-src": ["'none'"],
    "style-src": [
        "'self'"
    ],
    "script-src": [
        "'self'"
    ],
    "img-src": [
        "'self'"
    ], 
    "frame-src": [
        "'self'"
    ]
}
```

It used for decrease input csp logs for to simplify creating a white list

```bash
npm start -- directives

Create

Options:
  --version           Show version number                              [boolean]
  -h, --help          Show help                                        [boolean]
  --input, -i         Standard CSP log in JSON format        [string] [required]
  --output, -o        Output file in out/ with directives in JSON format[string]
  --repeats, -r       Number of domains repeats for wildcard replacing
                                                           [number] [default: 3]
  --autoSchema, --as  Add https and http protocol to generated domain names
                                                      [boolean] [default: false]
  --defaults, -d      Default CSP directives
                                           [string] [default: "./defaults.json"]
```

For example:
```bash
npm start -- directives -i ./test-data.json -o result-directives.json -r 3 --as -d ./defaults.json
```
will generate ./out/result-directives.json with domains divided by directives. Also it will be decreased by replacing repeating domains to wildcards:

```json
[
    "test.yandex.ru"
    "test1.yandex.ru"
    "test2.yandex.ru"
]
```

will be *.yandex.ru

# Rules

CSP rules

```bash
Create csp header from directives

Options:
  --version          Show version number                               [boolean]
  -h, --help         Show help                                         [boolean]
  --input, -i        Directives created by "generate directives" command
                                                             [string] [required]
  --output, -o       Output file in out/ with rules                     [string]
  --whiteList, --wl  Approved domains list in JSON format               [string]
  --reportUri, -r    Report URI                                         [string]
```

```bash
npm start -- rules -i ./out/result-directives.json -o rules.txt --wl ./white-list-domains.json -r https://test-report.com
```

will create ./out/rules.txt with applied white list and report uri

# License
csptool is released under the MIT license

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.