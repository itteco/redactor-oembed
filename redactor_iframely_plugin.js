(function($) {

    $.Redactor.prototype.iframely = function() {
        return {

            langs: {
                en: {
                    'iframely': 'Embed',
                    'enter-url': 'Enter URL you want to embed'
                }
            },

            getTemplate: function() {
				return String()
				+ '<div class="modal-section" id="redactor-modal-iframely-insert">'
					+ '<section>'
						+ '<label>' + this.lang.get('enter-url') + '</label>'
						+ '<input type="text" id="redactor-insert-iframely-area" />'
					+ '</section>'
                    + '<section id="redactor-modal-iframely-preview" style="overflow: auto;">'
                        + '&nbsp;'
                    + '</section>'
					+ '<section>'
						+ '<button id="redactor-modal-button-action">Insert</button>'
						+ '<button id="redactor-modal-button-cancel">Cancel</button>'
					+ '</section>'
				+ '</div>';
            },

            init: function() {

                this.iframely.cache = {};

                var button = this.button.addAfter('image', 'iframely', this.lang.get('iframely'));
                this.button.addCallback(button, this.iframely.show);

                this.core.element().on('linkify.callback.redactor', this.iframely.linkify);
                this.core.element().on('syncBefore.callback.redactor', this.iframely.syncBefore);
            },

            syncBefore: function(html) {
                // Restore original embed code from embed wrapper attribute value.
                var $data = $('<div>').html(html);
                $data.find('[data-embed-code]').each(function() {
                    var $this = $(this);
                    $this.html($this.attr('data-embed-code'));
                });

                return $data.html();
            },

            linkify: function($elements) {

                var that = this;

                $elements.each(function(i, el) {

                    var $el = $(el);
                    if ($el.is('a')) {
                        var uri = $el.attr('href');

                        var otherParagraphElements = $el.parent().contents().filter(function() {
                            var text = $.trim(this.textContent);
                            if (text.length === 1 && text.charCodeAt(0) === 8203) {
                                // Clear ZERO WIDTH SPACE.
                                text = '';
                            }
                            if (text) {
                                var href = this.getAttribute && this.getAttribute('href');
                                if (href !== uri) {
                                    // Paragraph has another links.
                                    return true;
                                }
                                if (!href) {
                                    // Paragraph has another text.
                                    return true;
                                }
                            }
                        });

                        if (otherParagraphElements.length) {
                            // Prevent insert inside paragraph with text.
                            return;
                        }

                        that.iframely.fetchUrl(uri, function(error, html) {

                            if (error || !html) {
                                // Skip iframely linkify.
                                return;
                            }

                            // buffer
                            that.buffer.set();

                            // insert
                            that.air.collapsed();

                            // remove current link
                            $el.remove();

                            var $node = $(html);
                            that.insert.node($node);

                            // place cursor after inserted node
                            that.caret.after($node);
                        });
                    }
                });
            },

            show: function() {

                var that = this;

                this.modal.addTemplate('iframely', this.iframely.getTemplate());

                this.modal.load('iframely', this.lang.get('iframely'), 700);

                // action button
                this.modal.getActionButton().text(this.lang.get('insert')).on('click', this.iframely.insert);
                this.modal.show();

                // Move modal to top.
                setTimeout(function() {

                    var $modalParent = $(that.modal.getModal()).parent();
                    var previewHeight = $(window).height() - $modalParent.height() - 16;

                    $modalParent.css('margin-top', '16px');

                    $('#redactor-modal-iframely-preview').css('max-height', previewHeight + 'px');

                }, 1);

                var $input = $('#redactor-insert-iframely-area');

                var keyupTimeout = null;
                $input.keyup(function() {

                    if (keyupTimeout) {

                        // Wait for next preview.

                        clearTimeout(keyupTimeout);

                        keyupTimeout = setTimeout(function() {
                            that.iframely.preview();
                            keyupTimeout = null;
                        }, 1000);

                    } else {

                        // First preview start immediately.

                        keyupTimeout = setTimeout(function() {
                            keyupTimeout = null;
                        }, 1000);

                        that.iframely.preview();
                    }
                });

                // focus
                if (this.detect.isDesktop()) {
                    setTimeout(function() {
                        $input.focus();
                    }, 1);
                }
            },

            preview: function() {

                var $input = $('#redactor-insert-iframely-area');

                var uri = $.trim($input.val());
                var previousUri = $.trim($input.attr('data-previous-value'));

                if (uri === previousUri) {
                    return;
                }

                $input.removeAttr('data-preview-html');
                $input.attr('data-previous-value', uri);

                var $preview = $('#redactor-modal-iframely-preview');

                var loadingTimeout = setTimeout(function() {
                    $preview.text('Loading...');
                }, 1500);

                this.iframely.fetchUrl(uri, function(error, html) {

                    clearTimeout(loadingTimeout);

                    if (error || !html) {

                        $preview.html('&nbsp;');

                    } else {

                        // Store result for later use.
                        $input.attr('data-preview-html', html);

                        $preview.html(html);
                    }
                });
            },

            insert: function() {

                var that = this;
                var $input = $('#redactor-insert-iframely-area');
                var uri = $.trim($input.val());
                var previewHtml = $input.attr('data-preview-html');

                function insert(html) {
                    that.modal.close();
                    that.placeholder.hide();

                    // buffer
                    that.buffer.set();

                    // insert
                    that.air.collapsed();

                    var $node = $(html);
                    that.insert.node($node);

                    // place cursor after inserted node
                    that.caret.after($node);
                }

                if (previewHtml) {

                    insert(previewHtml);

                } else {

                    this.iframely.fetchUrl(uri, function(error, html) {

                        if (error || !html) {

                            var $preview = $('#redactor-modal-iframely-preview');
                            $preview.text('Sorry, no embeds for this URL');

                        } else {

                            insert(html);
                        }
                    });
                }
            },

            fetchUrl: function(uri, cb) {

                if (!uri.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)\.(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i)) {
                    return cb();
                }

                var that = this;

                var data = that.iframely.cache[uri];

                if (data) {
                    return cb(data.error, data.html);
                }

                $.ajax({
                    url: this.opts.oembedEndpoint || 'http://open.iframe.ly/api/oembed',
                    dataType: "json",
                    data: {
                        url: uri,
                        origin: 'redactor'
                    },
                    success: function(data, textStatus, jqXHR) {

                        var html;

                        if (data && data.html) {
                            html = data.html;
                        } else if (data && !data.html && data.type === 'photo' && data.url) {
                            html = '<img src="' + data.url + '" title="' + (data.title || data.url)  + '" alt="' + (data.title || data.url)  + '" />';
                        }

                        if (html) {
                            var $div = $('<div>')
                                .attr('data-oembed-url', uri)
                                .attr('data-embed-code', html)
                                .html(html);

                            html = $('<div>').append($div).html();
                        }

                        that.iframely.cache[uri] = {
                            html: html
                        };

                        cb(null, html);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR && jqXHR.responseText || textStatus);

                        // TODO: parse responseText.
                        var error = jqXHR && jqXHR.responseText || textStatus;

                        that.iframely.cache[uri] = {
                            error: error
                        };

                        cb(error);
                    }
                });
            }

        };
    };
})(jQuery);