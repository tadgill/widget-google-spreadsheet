##Google Spreadsheet Widget

###Custom Layout Example

The following is an example HTML file for a custom layout. This layout does not have any HTML tables, but instead uses `div` tags and lists. It also shows the inline CSS within `<style>` tag and all the necessary `<source>` imports required for the widget to work.

```
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Google Spreadsheet Widget - List Example</title>
  
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    html {
      font-family: sans-serif;
    }

    body {
      margin: 0;
    }

    a:active, a:hover {
      outline: 0;
    }

    b, strong {
      font-weight: bold;
    }

    body {
      background: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    ul {
      list-style: none;
    }
    h3 {
      margin-bottom: 10px;
    }
    h4 {
      margin-bottom: 0;
      line-height: 1;
    }

    #scrollContainer {
      height: 100%;
      overflow: hidden;
    }

    .menus {
      margin-bottom: 20px;
      padding-bottom: 5px;
      border-bottom: 1px solid #EAEAEA;
    }
    .menus ul li {
      margin-bottom: 5px;
    }
    .menus ul ul {
      display: inline;
    }
    .menus ul ul li {
      display: inline;
      margin: 0 5px 0 0 ;
    }
    .A {
      font-family: Trebuchet MS, Helvetica, sans-serif;
      color: #22324B;
      font-size: 14px;
    }
    .changeUpIncrease, .changeDownDecrease, .valuePositivePositive, .valueNegativeNegative {
      color: rgb(0, 255, 0);
    }
    .changeUpDecrease, .changeDownIncrease, .valuePositiveNegative, .valueNegativePositive {
      color: rgb(255,0,0);
    }
  </style>
  </head>
<body>
 <div id="scrollContainer">
  <div id="menu" class="page">
    <div class="repeat item menus">
    <!-- Shows data in Column A using the custom styling specified in the above CSS. -->
      <h3 class="A"></h3>
      <ul>
        <li>
          <div>
            <!-- Shows data in Column B using the Heading Font style. -->
            <h4 class="B heading_font-style"></h4>
            <!-- Shows data in Column C using the Data Font style. -->
            <span class="C data_font-style"></span>
            <ul>
              <li>
                <!-- Shows data in Column D using the Data Font style. -->
                <span class="D data_font-style"></span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
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