##Google Spreadsheet Widget

###Custom Layout Example

The following is an example HTML file for a custom layout. This layout uses a `<table>` and makes use of the CSS classes for displaying images and QR codes. It also shows the inline CSS within `<style>` tag and all the necessary `<source>` imports required for the widget to work.

```
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Google Spreadsheet Widget - Table & Images Example</title>
  <style>
    body {
      background: transparent;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      font-weight: normal;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    #scrollContainer {
      height: 100%;
      overflow: hidden;
    }

    .changeUpIncrease, .changeDownDecrease, .valuePositivePositive, .valueNegativeNegative {
      color: rgb(0, 255, 0);
    }
    .changeUpDecrease, .changeDownIncrease, .valuePositiveNegative, .valueNegativePositive {
      color: red;
    }


  </style>
</head>
<body>
 <div id="scrollContainer">
  <table class="page">
    <thead>
    <tr class="heading_font-style">
      <!-- The headings for Columns A-D. There must be one heading per column.
                 Change the text to something more appropriate for your particular data. -->
      <th>Name</th>
      <th>Logo</th>
      <th>QR Code</th>
    </tr>
    </thead>
    <tbody>
    <tr class="repeat item data_font-style">
      <!-- Shows data in Columns A-D. Customize this for your particular data. -->
      <td class="A"></td>
      <td class="B image"></td>
      <td class="C qrCode"></td>
    </tr>
    </tbody>
  </table>
</div>

 <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
 
  <!-- Necessary source code for auto-scroll plugin -->
 <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/TweenLite.min.js"></script>
 <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/plugins/CSSPlugin.min.js"></script>
 <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/utils/Draggable.min.js"></script>
 <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/plugins/ScrollToPlugin.min.js"></script>
 
 <!-- Club GreenSock Members Only Plugin, subject to its own license: http://greensock.com/club/ -->
 <script src="//s3.amazonaws.com/rise-common/scripts/greensock/ThrowPropsPlugin.min.js"></script>

 <!-- Source code for google apis -->
 <script src="https://www.google.com/jsapi"></script>

 <!-- Source code for gadgets api -->
 <script src="//rvashow2.appspot.com/gadgets/gadgets.min.js"></script>

 <!-- Source code for google spreadsheet widget -->
 <script src="//s3.amazonaws.com/widget-google-spreadsheet/0.1.0/dist/js/widget.min.js"></script>

</body>
</html>

```