(function($) {

    $.Redactor.prototype.iframely = function() {
        return {

            langs: {
                en: {
                    'iframely': 'Iframely',
                    'enter-url': 'Enter url to embed'
                }
            },

            getTemplate: function() {
				return String()
				+ '<div class="modal-section" id="redactor-modal-iframely-insert">'
					+ '<section>'
						+ '<label>' + this.lang.get('enter-url') + '</label>'
						+ '<input type="text" id="redactor-insert-iframely-area" />'
					+ '</section>'
                    + '<section id="redactor-modal-iframely-preview" style="display: none;">'
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

                            // buffer
                            that.buffer.set();

                            // insert
                            that.air.collapsed();
                            $el.parent().html(html);
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

                var $input = $('#redactor-insert-iframely-area');

                $input.keyup(this.iframely.preview);

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
                $preview.text('Loading...').show();

                this.iframely.fetchUrl(uri, function(error, html) {

                    if (error) {

                        $preview.hide().html('');

                    } else {

                        // Store result for later use.
                        $input.attr('data-preview-html', html);

                        $preview.html(html).show();
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
                    that.insert.html(html);
                }

                if (previewHtml) {

                    insert(previewHtml);

                } else {

                    this.iframely.fetchUrl(uri, function(error, html) {

                        if (error || !html) {

                            var $preview = $('#redactor-modal-iframely-preview');
                            $preview.text('Sorry, no embeds for this URL').show();

                        } else {

                            insert(html);
                        }
                    });
                }
            },

            fetchUrl: function(uri, cb) {

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