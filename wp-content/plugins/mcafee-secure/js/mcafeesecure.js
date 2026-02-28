jQuery(function() {
    var $activationSection = jQuery("#mcafeesecure-activation");
    var $dashboardSection = jQuery("#mcafeesecure-dashboard");

    var $sideframeSection = jQuery("#mcafeesecure-sideframe");

    var $mfeProSection = jQuery("#mcafeesecure-pro");
    var $tsProSection = jQuery("#trustedsite-pro");
    
    var $mfeEngagementSection = jQuery("#mcafeesecure-engage");
    var $tsEngagementSection = jQuery("#ts-engage");

    var $bottomLogo = jQuery("#ts-logo-noframe");
    var $sideLogo = jQuery("#ts-logo-sideframe");
    
    var $data = jQuery("#mcafeesecure-data");
    
    var host = $data.attr('data-host');
    if (!host) { host = ''; }
    if (host.startsWith("www.")) { host = host.substr(4); }

    var email = $data.attr('data-email');
    if (!email) { email = ''; }

    var affiliate = 221269;

    var endpointUrl = 'https://www.trustedsite.com';
    var apiUrl = endpointUrl + '/rpc/ajax?do=lookup-site-status&host=' + encodeURIComponent(host)
    var upgradeUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/upgrade";
    var diagnosticsUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/diagnostics";
    var sipUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/cert/sip";
    var profileUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/sitemap";
    var securityUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/cert/secure";
    var floatingTrustmarkUrl = endpointUrl + "/user/site/" + encodeURIComponent(host)+ "/tm/floating";
    var directoryUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/setup/directory";
    var engagementTrustmarkUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/tm/engagement";
    var sipUpUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/upgrade";
    var sitemapUpUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/add?product=12";
    var diagUpUrl = endpointUrl + "/user/site/" + encodeURIComponent(host) + "/add?product=11";

    jQuery("#activate-now").click(function() {
        var email_input = jQuery('#email-input').val();
        var domain_input = jQuery('#domain-input').val();
        var signupUrl = "https://www.trustedsite.com/start?host=" + encodeURIComponent(domain_input)
                                            + "&email=" + encodeURIComponent(email_input) 
                                            + "&affId=" + encodeURIComponent(affiliate)
                                            + "&renew=year"
                                            + "&utm_source=wordpress";
        var signupWindow = window.open(signupUrl);
    });

    function renderSecurity(data) {
        var issuesFound = data['diagnosticsFoundIssues'] === 1;
        var $row = jQuery("#security");
        var secure = data['isSecure'] === 1;
        var inProgress = data['scanInProgress'] === 1;

        if (inProgress) {
            setLinkText($row, "Security scan in progress...");
            spinIcon($row);
        } else {
            if (secure) {
                setLinkText($row, "All tests passed");
                checkIcon($row);
            } else {
                setLinkText($row, "Security issues");
                warningIcon($row);
            }
        }
        setLinkHref($row, securityUrl);
    }

    function renderFloatingTrustmark(data) {
        var pro = data['isPro'] === 1;
        var $row = jQuery("#floating-trustmark");
        var exceeded = data['maxHitsExceeded'] === 1;

        if (pro) {
            setLinkText($row, "Active");
            checkIcon($row);
            setLinkHref($row, floatingTrustmarkUrl);
        } else {
            if (exceeded) {
                setLinkText($row, "Monthly vistitor limit reached");
                timesIcon($row);
                setLinkHref($row, upgradeUrl);
            } else {
                setLinkText($row, "Active");
                checkIcon($row);
                setLinkHref($row, floatingTrustmarkUrl);
            }
        }
    }

    function renderDirectoryListing(data) {
    	var complete = data['profileDone'] === 1;
        var $row = jQuery("#directory-listing");

        if (complete) {
            checkIcon($row);
            setLinkText($row, "Complete")
        } else {
            circleIcon($row);
            setLinkText($row, "Update now")
        }
        setLinkText($row, "Update");
        setLinkHref($row, directoryUrl);
    }

    function renderEngagementTrustmark(data) {
        var pro = data['isPro'] === 1;
        var $row = jQuery("#engagement-trustmark");

        if (pro) {
            var installed = data['tmEngagementInstalled'] === 1;
            if (installed) {
                setLinkText($row, "Active");
                checkIcon($row);
            } else {
                setLinkText($row, "Add now");
                circleIcon($row);
            }
            setLinkHref($row, engagementTrustmarkUrl);
        } else {
            setLinkText($row, "Upgrade");
            lockIcon($row);
            setLinkHref($row, upgradeUrl);
        }
    }

    function renderSip(data) {
        var sipEnabled = data['sipEnabled'] === 1;
        var $row = jQuery("#sip");

        if (sipEnabled) {
            if (sipEnabled) {
                setLinkText($row, "Active");
                checkIcon($row);
                setLinkHref($row, sipUrl);
            }
        } else {
            setLinkText($row, "Upgrade");
            lockIcon($row);
            setLinkHref($row, sipUpUrl);
        }
    }

    function renderSearchSubmission(data) {
        var sitemapEnabled = data['sitemapEnabled'] === 1;
        var num = data['sitemapUrlCount'];
        var $row = jQuery("#search-submission");

        if (sitemapEnabled) {
            if (num === 0) {
                setLinkText($row, "Enabled");
            } else {
                setLinkText($row, num + " pages");
            }
            checkIcon($row);
            setLinkHref($row, profileUrl);
        } else {
            setLinkText($row, "Upgrade");
            lockIcon($row);
            setLinkHref($row, sitemapUpUrl);
        }
    }

    function renderDiagnostic(data) {
        var diagnosticsEnabled = data['diagnosticsEnabled'] === 1;
        var issuesFound = data['diagnosticsFoundIssues'] === 1;
        var $row = jQuery("#diagnostics");

        if (diagnosticsEnabled) {
            if (issuesFound) {
                setLinkText($row, "Issues found");
                warningIcon($row);
            } else {
                setLinkText($row, "No issues found");
                checkIcon($row);
            }
            setLinkHref($row, diagnosticsUrl);
        } else {
            setLinkText($row, "Upgrade");
            lockIcon($row);
            setLinkHref($row, diagUpUrl);
        }
    }

    function setLinkText($el, linkText) {
        $el.find(".link").html(linkText);
    }

    function setLinkHref($el, href) {
        var link = "<a href=" + href + " target=\"_blank\" style=\"text-decoration:none\"></a>"
        $el.wrap(link);
    }

    function checkIcon($el) {
        $el.find('.status-icon').html('<i class="fa fa-check-circle"></i>');
    }

    function timesIcon($el) {
        $el.find('.status-icon').html('<i class="fa fa-times-circle"></i>');
    }

    function warningIcon($el) {
        $el.find('.status-icon').html('<i class="fa fa-warning"></i>');
    }

    function spinIcon($el) {
        $el.find('.status-icon').html('<i class="fa fa-circle-o-notch fa-spin"></i>');
    }

    function circleIcon($el) {
        $el.find('.status-icon').html('<i class="fa fa-circle-thin"></i>');
    }

    function lockIcon($el) {
        $el.find('.status-icon').html('<i class="fa fa-lock"></i>');
    }

    function refresh() {
        jQuery.getJSON(apiUrl, function(data) {
            var status = data['status'];
            if (status === "none") {
                $activationSection.show();
                $dashboardSection.hide();
            } else {
                $activationSection.hide();
                setTimeout(function() {
                    clearInterval(refreshInterval);
                    loadDashboard();
                }, 500);
            }
        });
    }

    function loadDashboard() {
        jQuery.getJSON(apiUrl, function(data) {
            renderSecurity(data);
            renderFloatingTrustmark(data);
            renderDirectoryListing(data);
            renderEngagementTrustmark(data);
            renderSip(data);
            renderSearchSubmission(data);
            renderDiagnostic(data);

            if (data['isPro'] !== 1 && data['brand'] === 'mfe') {
                $sideframeSection.show();
                $mfeProSection.show();
                $tsProSection.hide();
            } else if (data['isPro'] !== 1 && data['brand'] === 'ts') {
                $sideframeSection.show();
                $mfeProSection.hide();
                $tsProSection.show();
                $sideLogo.hide();
            } else if (data['tmEngagementInstalled'] !== 1 && data['brand'] === 'mfe') {
                $sideframeSection.show()
                $mfeEngagementSection.show();
                $tsEngagementSection.hide();
                $tsProSection.hide();
                $mfeProSection.hide();
            } else if (data['tmEngagementInstalled'] !== 1 && data['brand'] === 'ts') {
                $sideframeSection.show()
                $mfeEngagementSection.hide();
                $tsEngagementSection.show();
                $tsProSection.hide();
                $mfeProSection.hide();
                $sideLogo.hide();
            } else {
                $bottomLogo.show();
            }
            $dashboardSection.show();
        });
    }

    var refreshInterval = setInterval(refresh, 1000);
    refresh();
});
