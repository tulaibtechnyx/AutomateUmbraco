<!-- example 1 -->

  <section class="sec-padded sec-resources featureInfoCards">
        <div class="container">
            <div class="secWrap">
                <div class="contentWrap">
                    <div class="secContentWrap" data-aos="fade-up">
                        <p class="subTitle menu16">1% OF THE INDUSTRY</p>
                        <h2 class="heading2"><u>Hub</u> for Media & Creativity</h2>
                        <p class="body22">Dubai offers a media ecosystem where creativity and innovation thrive.</p>
                    </div>                <div class="cardContainer">
                        <div class="cardModule--resources" data-aos="fade-up" data-aos-delay="200">
                            <div class="cardImg">
                                <img src="../assets/images/thumbs/info-card-img.webp" alt="">
                            </div>
                            <div class="mainContent">
                                <div class="cardTitle">
                                    <h5 class="contentHeader">Execute vertical integration</h5>
                                    <p class="body18 boxDescription">
                                        Funnel stakeholder engagement yet and funnel stakeholder 
                                    </p>
                                </div>
                                <div class="ctaBox">
                                    <a href="javascript:;" class="primary-btn noTxt">
                                      <img
                                        src="../assets/images/svgs/arrow-right.svg"
                                        alt=""
                                        class="js-tosvg btn-icon"
                                      />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="cardModule--resources" data-aos="fade-up" data-aos-delay="200">
                            <div class="cardImg">
                                <img src="../assets/images/thumbs/info-card-img.webp" alt="">
                            </div>
                            <div class="mainContent">
                                <div class="cardTitle">
                                    <h5 class="contentHeader">Execute vertical integration</h5>
                                    <p class="body18 boxDescription">
                                        Funnel stakeholder engagement yet and funnel stakeholder 
                                    </p>
                                </div>
                                <div class="ctaBox">
                                    <a href="javascript:;" class="primary-btn noTxt">
                                      <img
                                        src="../assets/images/svgs/arrow-right.svg"
                                        alt=""
                                        class="js-tosvg btn-icon"
                                      />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="cardModule--resources" data-aos="fade-up" data-aos-delay="200">
                            <div class="cardImg">
                                <img src="../assets/images/thumbs/info-card-img.webp" alt="">
                            </div>
                            <div class="mainContent">
                                <div class="cardTitle">
                                    <h5 class="contentHeader">Execute vertical integration</h5>
                                    <p class="body18 boxDescription">
                                        Funnel stakeholder engagement yet and funnel stakeholder 
                                    </p>
                                </div>
                                <div class="ctaBox">
                                    <a href="javascript:;" class="primary-btn noTxt">
                                      <img
                                        src="../assets/images/svgs/arrow-right.svg"
                                        alt=""
                                        class="js-tosvg btn-icon"
                                      />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="btnWrap" data-aos="fade-up">
                        <a href="javascript:;" class="primary-btn whiteBorder dark-bg">
                            <span class="btn-text buttonText20 medium16">Explore More</span>
                        </a>
                        <a href="javascript:;" class="secondary-btn dark-bg">
                            <span class="btn-text buttonText20 medium16">Explore More</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

<!-- example 1 end -->

    <!-- ModelOutput -->

{
"alias": "featureInfoCards",
"name": "Feature Info Cards",
"properties": [
{
"alias": "subTitle",
"name": "Subtitle",
"typeAlias": "Umbraco.TextBox"
},
{
"alias": "mainHeading",
"name": "Main Heading",
"typeAlias": "Umbraco.TextBox"
},
{
"alias": "description",
"name": "Description",
"typeAlias": "Umbraco.TinyMCE"
},
{
"alias": "cards",
"name": "Cards",
"typeAlias": "Umbraco.BlockList"
},
{
"alias": "primaryCta",
"name": "Primary Call to Action",
"typeAlias": "Umbraco.MultiUrlPicker"
},
{
"alias": "secondaryCta",
"name": "Secondary Call to Action",
"typeAlias": "Umbraco.MultiUrlPicker"
}
],
"subModels": [
{
"alias": "infoCard",
"name": "Info Card",
"properties": [
{
"alias": "image",
"name": "Image",
"typeAlias": "Umbraco.MediaPicker3"
},
{
"alias": "cardTitle",
"name": "Card Title",
"typeAlias": "Umbraco.TextBox"
},
{
"alias": "boxDescription",
"name": "Box Description",
"typeAlias": "Umbraco.TinyMCE"
},
{
"alias": "ctaLink",
"name": "Call to Action Link",
"typeAlias": "Umbraco.MultiUrlPicker"
}
]
}
],
"razorCode": "@using DMC.Common.Helpers\r\n@using DMC.Common.Models.CMS\r\n@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.FeatureCards>\r\n@{\r\n var ViewLocation = ViewContext.ExecutingFilePath;\r\n var currentLanguage = Context.Request.GetCurrentLanguage();\r\n var items = Model.Cards?.ToList() ?? new List<Umbraco.Cms.Core.Models.Blocks.BlockListItem>();\r\n var hasPrimaryCta = Common.IsCtaNotNull(Model.PrimaryCta);\r\n var hasSecondaryCta = Common.IsCtaNotNull(Model.SecondaryCta);\r\n}\r\n\r\n<section class=\"sec-padded sec-resources featureInfoCards\">\r\n <div class=\"container\">\r\n <div class=\"secWrap\">\r\n <div class=\"contentWrap\">\r\n <div class=\"secContentWrap\" data-aos=\"fade-up\">\r\n <p class=\"subTitle menu16\">@Model.SubTitle</p>\r\n <h2 class=\"heading2\"><u>Hub</u> for Media & Creativity</h2>\r\n <p class=\"body22\">@Html.Raw(Model.Description.ReplacePTagFromRTE().ToString())</p>\r\n </div>\r\n <div class=\"cardContainer\">\r\n @foreach (var blockItem in items) {\r\n var row = blockItem.Content as InfoCard;\r\n if (row != null) {\r\n <div class=\"cardModule--resources\" data-aos=\"fade-up\" data-aos-delay=\"200\">\r\n <div class=\"cardImg\">\r\n <img src=\"@Common.GetMediaUrl(row.Image)\" alt=\"\">\r\n </div>\r\n <div class=\"mainContent\">\r\n <div class=\"cardTitle\">\r\n <h5 class=\"contentHeader\">@row.CardTitle</h5>\r\n <p class=\"body18 boxDescription\">@Html.Raw(row.BoxDescription.ReplacePTagFromRTE().ToString())</p>\r\n </div>\r\n <div class=\"ctaBox\"> \r\n <a href=\"@row.CtaLink.Url\" class=\"primary-btn noTxt\">\r\n <img src=\"../assets/images/svgs/arrow-right.svg\" alt=\"\" class=\"js-tosvg btn-icon\" />\r\n </a>\r\n </div>\r\n </div>\r\n </div>\r\n }\r\n }\r\n </div>\r\n <div class=\"btnWrap\" data-aos=\"fade-up\">\r\n @if (hasPrimaryCta) {\r\n <a href=\"@Model.PrimaryCta.Url\" class=\"primary-btn whiteBorder dark-bg\">\r\n <span class=\"btn-text buttonText20 medium16\">@Model.PrimaryCta.Name</span>\r\n </a>\r\n }\r\n @if (hasSecondaryCta) {\r\n <a href=\"@Model.SecondaryCta.Url\" class=\"secondary-btn dark-bg\">\r\n <span class=\"btn-text buttonText20 medium16\">@Model.SecondaryCta.Name</span>\r\n </a>\r\n }\r\n </div>\r\n </div>\r\n </div>\r\n </div>\r\n</section>"
}
<!-- ModelOutput -->

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
