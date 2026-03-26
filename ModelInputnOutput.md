  <!-- Input to Model -->
  <section class="banner-wrapper sec-padded">
      <div class="container">
        <div class="banner-box">
          <img src="../assets/images/svgs/info.svg" alt="Info icon" class="info-icon js-tosvg" />
          <div class="banner-content">
            <div class="title-with-description">
              <h5 class="banner-title heading5">Some kind of alert!</h5>
              <p class="banner-description caption">This is an alert message that will be placed inside the 
                body of this alert box. It is important to note that these alert boxes 
                can contain any kind of messages, from informational to warning to 
                success ones.
              </p>
            </div>
            <div class="ctas-box">
              <a href="javascript:;" class="sec-cta primary-btn dark-bg ">
                <span class="btn-text buttonText20 medium16">BUTTON</span>
              </a>
              <a href="javascript:;" class="sec-cta secondary-btn dark-bg ">
                <span class="btn-text buttonText20 medium16">BUTTON</span>
              </a>
            </div>
          </div>
          <img src="../assets/images/svgs/banner-close.svg" alt="Close icon" class="close-icon js-tosvg" />
        </div>
        </div>
      </div>
  </section>
  
  <br><br>
  
  <section class="banner-wrapper sec-padded without-ctas">
      <div class="container">
        <div class="banner-box">
          <img src="../assets/images/svgs/info.svg" alt="Info icon" class="info-icon js-tosvg" />
          <div class="banner-content">
            <div class="title-with-description">
              <p class="banner-description caption">This is an alert message that will be placed inside the 
                body of this alert box. It is important to note that these alert boxes 
                can contain any kind of messages, from informational to warning to 
                success ones.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
  </section>
  <!-- Output Model give -->
{
  "alias": "bannerBlock",
  "name": "Banner Block",
  "properties": [
    {
      "alias": "bannerTitle",
      "name": "Banner Title",
      "typeAlias": "Umbraco.TextArea"
    },
    {
      "alias": "bannerDescription",
      "name": "Banner Description",
      "typeAlias": "Umbraco.TinyMCE"
    },
    {
      "alias": "infoIcon",
      "name": "Info Icon",
      "typeAlias": "Umbraco.MediaPicker3"
    },
    {
      "alias": "closeIcon",
      "name": "Close Icon",
      "typeAlias": "Umbraco.MediaPicker3"
    },
    {
      "alias": "primaryCta",
      "name": "Primary CTA",
      "typeAlias": "Umbraco.MultiUrlPicker"
    },
    {
      "alias": "secondaryCta",
      "name": "Secondary CTA",
      "typeAlias": "Umbraco.MultiUrlPicker"
    }
  ],
  "razorCode": "@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.BannerBlock>\n@using DMC.Common.Helpers\n@using DMC.Common.Models.CMS\n@{\n    var ViewLocation = ViewContext.ExecutingFilePath;\n    var currentLanguage = Context.Request.GetCurrentLanguage();\n}\n@using (new FunctionTracer(true, Model?.ContentType?.Alias ?? string.Empty)) {\n    if (Model != null) {\n        try {\n            <section class=\"banner-wrapper sec-padded\">\n                <div class=\"container\">\n                    <div class=\"banner-box\">\n                        <img src=\"@Umbraco.Media(Model.InfoIcon).Url()\" alt=\"@Model.InfoIcon.Name\" class=\"info-icon js-tosvg\" />\n                        <div class=\"banner-content\">\n                            <div class=\"title-with-description\">\n                                @if (!string.IsNullOrEmpty(Model.BannerTitle)) {\n                                    <h5 class=\"banner-title heading5\">@Model.BannerTitle</h5>\n                                }\n                                <p class=\"banner-description caption\">@Html.Raw(Model.BannerDescription.ReplacePTagFromRTE().ToString())</p>\n                            </div>\n                            @if (Common.IsCtaNotNull(Model.PrimaryCta) || Common.IsCtaNotNull(Model.SecondaryCta)) {\n                                <div class=\"ctas-box\">\n                                    @if (Common.IsCtaNotNull(Model.PrimaryCta)) {\n                                        <a href=\"@Model.PrimaryCta.Url\" target=\"@(Model.PrimaryCta.Target ?? \"_self\")\" class=\"sec-cta primary-btn dark-bg\">\n                                            <span class=\"btn-text buttonText20 medium16\">@Model.PrimaryCta.Name</span>\n                                        </a>\n                                    }\n                                    @if (Common.IsCtaNotNull(Model.SecondaryCta)) {\n                                        <a href=\"@Model.SecondaryCta.Url\" target=\"@(Model.SecondaryCta.Target ?? \"_self\")\" class=\"sec-cta secondary-btn dark-bg\">\n                                            <span class=\"btn-text buttonText20 medium16\">@Model.SecondaryCta.Name</span>\n                                        </a>\n                                    }\n                                </div>\n                            }\n                        </div>\n                        <img src=\"@Umbraco.Media(Model.CloseIcon).Url()\" alt=\"@Model.CloseIcon.Name\" class=\"close-icon js-tosvg\" />\n                    </div>\n                </div>\n            </section>\n        } catch (Exception ex) { throw; }\n    }\n}"
}
