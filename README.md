# Redactor iframely plugin

Example plugin setup configuration (except usual things):

    <!-- Redactor's plugin -->

    <!-- Setup plugin css. -->
    <link rel="stylesheet" href="iframely.css" />
    <!-- Setup iframely.js lib. -->
    <script src="http://iframely.com/r3/js/iframely.js"></script>
    <!-- Setup iframely redactor plugin. -->
    <script src="iframely.js"></script>

    <!-- Call Redactor -->
    <script type="text/javascript">

        // Setup custom iframely endpoint path.
        // $.iframely.defaults.endpoint = 'http://yourdomain/iframely';

        $(document).ready(function() {
            $('#redactor').redactor({
                focus: true,
                plugins: ['iframely']
            });
        });
    </script>

Plugin modal form html code:

    <!-- iframely Modal HTML -->
    <div id="iframelyModal" style="display: none;">
        <section class="iframely_box">
            <div class="iframely_form">
                <input type="uri" placeholder="enter URI"><button>preview</button>
            </div>
            <div class="results">
            </div>
        </section>
        <footer>
            <a href="#" class="redactor_modal_btn redactor_btn_modal_close">Close</a>
        </footer>
    </div>