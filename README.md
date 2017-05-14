# Weather Balloon Radiosonde Tracker
This project visualizes the data of Vaisala RS radiosonde.

Track and graph the path in 2D and 3D.

Plot charts about vars with time or vars with height.

Plot skew T/log P chart.

## Demo
![](https://raw.githubusercontent.com/tigercosmos/webImg/master/balloon.gif)

## Test Environment
python 2.7, node.js 4.4+, the code tests in Windows

## Excute
```bash
git clone https://github.com/tigercosmos/Weather-Balloon-Radiosonde-Tracker.git
```
```bash
cd Weather-Balloon-Radiosonde-Tracker
```
```bash
node app.js
```
then the server will run and call the index.html

## Introduction
<ol>
<li>Choose files what you want to see, and click "<i>Upload File</i>". It supports multi-files.&nbsp;</li>
<li>You can see the list of files auto-refreshed, if not click "<i>Refresh</i>."</li>
<li>The files in the list are what will show in the program. You can select certain files by checkbox to delete files you don't want to show.&nbsp;</li>
<li>Before you show the data, you can upload and delete files many times.</li>
<li>After finish the list, click "<i>Calculate</i>" to get data from files. When it is running, it shows "<i>running...</i>"; when it finished, it shows "<i>Done</i>!"</li>
<li>After calculation, click "<i>Plot Category</i>" in the home page or "<i>Show</i>" in the other page to show the data virtualization.&nbsp;</li>
<li>Repeat progress 1~6 to change the files you want to see.</li>
<li>Once you calculate and get data, you can click "<i>Plot</i>" at the navigation bar or "<i>Plot Category</i>" to change what kind of plots you want to see.</li>
 </ol>
 
## Reference 
This Skew T/Log P diagram is referenced by Ryan Sobash's <a href="https://github.com/rsobash/d3-skewt">Repo</a>.
 
## License 
The MIT License (MIT)
 
 
