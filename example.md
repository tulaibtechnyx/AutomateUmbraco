<!-- EXAMPLE 0 -->
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
<!-- EXAMPLE 1 -->

<!-- HTML Code -->
  <section class="container">
     <div class="breadcrumb">
       <ul>
         <li class="buttonText20 small14" data-aos="fade-up" data-aos-delay="100">
           <a  href="javascript:;">Home</a>
           <img src="/assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
         </li>
         <li class="buttonText20 small14" data-aos="fade-up" data-aos-delay="200">
           <a href="javascript:;">Settings</a>
           <img src="/assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg"/>
         </li>
         <li class="buttonText20 small14" data-aos="fade-up" data-aos-delay="300">
           <a  href="javascript:;">Edit Profile</a>
           <img src="/assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg"/>
         </li>
         <li  class="buttonText20 small14" data-aos="fade-up" data-aos-delay="400">
           <span>Upload Pictures</span>
         </li>
       </ul>
     </div>
   </section>

<!-- What Our Model Gave us -->

{
"alias": "breadcrumbComponent",
"name": "Breadcrumb Component",
"properties": [
{
"alias": "links",
"name": "Links",
"dataType": "Umbraco.MultiNodeTreePicker"
},
{
"alias": "icons",
"name": "Icons",
"dataType": "MediaPicker"
},
{
"alias": "animations",
"name": "Animations",
"dataType": "Textstring"
}
],
"razorCode": "@foreach (var link in Model.Value<IEnumerable<IPublishedContent>>(\"links\")) {<li>@link.Name<img src=\"@link.GetCropUrl(\"icons\")\" alt=\"\" /></li>}"
}

<!-- What Our Model Build in Umbraco -->

@foreach (var link in Model.Value<IEnumerable<IPublishedContent>>("links"))
{

<li>@link.Name<img src="@link.GetCropUrl("icons")" alt="" /></li>
}

<!-- Code I made in Umbraco  Expected tra=in our model according to it-->

@using DMC.Common.Helpers
@using DMC.Common.Models.CMS
@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.Breadcrumb>
@{
var ViewLocation = ViewContext.ExecutingFilePath;
var currentLanguage = Context.Request.GetCurrentLanguage();
var BreadcrumbHomeLabel = Common.GetDictionaryValueOrDefault(Constants.Dictionary.Home, currentLanguage);
NavItem navigationItem = Model.NavigationPicker as NavItem;
}

@using (new FunctionTracer(true, Model?.ContentType.Alias ?? string.Empty))
{
if (Model != null)
{
try
{

<section class="container"
@Constants.cms_component_name ="@Model.Name"
@Constants.cms_component_alias ="@Model.ContentType?.Alias"
@Constants.cms_component_view_location ="@ViewLocation">
<div class="breadcrumb">
<ul>
@if (!string.IsNullOrEmpty(BreadcrumbHomeLabel))
{
<li class="buttonText20 small14" data-aos="fade-up" data-aos-delay="100">
<a href="/@currentLanguage/">@BreadcrumbHomeLabel</a>
<img loading="lazy" src="/assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
</li>
}
@if (navigationItem?.Parent is NavItem navItem)
{
@if (!string.IsNullOrEmpty(navItem.Cta?.Url))
{
<li class="buttonText20 small14" data-aos="fade-up" data-aos-delay="200">
<a href="@navItem.Cta.Url">@navItem.Cta.Name</a>
<img loading="lazy" src="/assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
</li>
}

                        }
                        @if (navigationItem != null && !string.IsNullOrEmpty(navigationItem.Cta?.Url))
                        {
                            <li class="buttonText20 small14" data-aos="fade-up" data-aos-delay="300">
                                @if (string.IsNullOrEmpty(Model.CurrentPage?.Url))
                                {
                                    <span>@navigationItem.Cta.Name</span>
                                }
                                else if (!string.IsNullOrEmpty(Model.CurrentPage?.Url))
                                {
                                    <a href="@navigationItem.Cta.Url">@navigationItem.Cta.Name</a>
                                    <img loading="lazy" src="/assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
                                }
                            </li>
                        }
                        @if (!string.IsNullOrEmpty(Model.CurrentPage?.Url))
                        {
                            <li class="buttonText20 small14 active" data-aos="fade-up" data-aos-delay="400">
                                <span>@Model.CurrentPage.Name</span>
                            </li>
                        }
                    </ul>

                </div>
            </section>
        }
        catch (Exception ex)
        {
            throw;
        }
    }

}

<!-- example 2 -->
<!-- fe code -->
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
  <!-- what i made in umbraco -->
  @using DMC.Common.Helpers
@using DMC.Common.Models.CMS
@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.Alert>
@{
    var ViewLocation = ViewContext.ExecutingFilePath;
    var currentLanguage = Context.Request.GetCurrentLanguage();
    var heading = Common.GetDictionaryValueOrDefault(Constants.Dictionary.Home, currentLanguage);

    var hasHeading = !string.IsNullOrEmpty(Model.Heading);
    var hasDescription = !string.IsNullOrEmpty(Model.Description.ReplacePTagFromRTE().ToString());
    var hasPrimaryCta = Common.IsCtaNotNull(Model.PrimaryCta);
    var hasSecondaryCta = Common.IsCtaNotNull(Model.SecondaryCta);

}
@using (new FunctionTracer(true, Model?.ContentType.Alias ?? string.Empty))
{
if (Model != null)
{
try
{

<section class="banner-wrapper sec-padded @(hasPrimaryCta || hasSecondaryCta ? "" : "without-ctas")">
<div class="container">
<div class="banner-box">
<img src="/assets/images/svgs/info.svg" alt="Info icon" class="info-icon js-tosvg" />
<div class="banner-content">
@if (!string.IsNullOrEmpty(Model.Heading) || !string.IsNullOrEmpty(Model.Description.ReplacePTagFromRTE().ToString()))
{
<div class="title-with-description">
@if (hasHeading)
{
<h5 class="banner-title heading5">@Model.Heading</h5>
}
@if (hasDescription)
{
@Html.Raw(Model.Description)
}
</div>
}
@if (Common.IsCtaNotNull(Model.PrimaryCta) || Common.IsCtaNotNull(Model.SecondaryCta))
{
<div class="ctas-box">
@if (hasPrimaryCta)
{
<a href="@Model.PrimaryCta.Url" class="sec-cta primary-btn dark-bg ">
<span class="btn-text buttonText20 medium16">@Model.PrimaryCta.Name</span>
</a>
}
@if (hasSecondaryCta)
{
<a href="@Model.SecondaryCta.Url" class="sec-cta secondary-btn dark-bg ">
<span class="btn-text buttonText20 medium16">@Model.SecondaryCta.Name</span>
</a>
}
</div>
}
</div>
@if (hasPrimaryCta || hasSecondaryCta)
{
<img src="/assets/images/svgs/banner-close.svg" alt="Close icon" class="close-icon js-tosvg" />
}
</div>
</div>
</section>
}
catch (Exception ex)
{
throw;
}
}
}

<!-- example 3 -->
<!-- fe code -->

    <section class="banner-wrapper announcement-banner-top">
      <div class="container">
        <div class="banner-box">
          <img src="../assets/images/svgs/info.svg" alt="Info icon" class="info-icon js-tosvg" />
          <div class="banner-content">
            <div class="title-with-description">
              <p class="banner-description body18">New media licensing guidelines have been
                published for industry stakeholders. All relevant entities are encouraged
                to review the updated requirements
              </p>
            </div>
            <div class="ctas-box btnWrap">
              <a href="javascript:;" class="sec-cta primary-btn light-bg">
                <span class="btn-text buttonText20 medium16">VIEW DETAILS</span>
              </a>
              <a href="javascript:;" class="sec-cta secondary-btn light-bg">
                <span class="btn-text buttonText20 medium16">KNOW MORE</span>
              </a>
            </div>
          </div>
          <img src="../assets/images/svgs/banner-close.svg" alt="Close icon" class="close-icon js-tosvg" />
        </div>
        </div>
      </div>

  </section>
<!-- what i made in umbraco -->
@using DMC.Common.Helpers
@using DMC.Common.Models.CMS
@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.AnnouncementBanner>
@{
    var ViewLocation = ViewContext.ExecutingFilePath;
    var currentLanguage = Context.Request.GetCurrentLanguage();
    var heading = Common.GetDictionaryValueOrDefault(Constants.Dictionary.Home, currentLanguage);
}

<section class="banner-wrapper announcement-banner-top">
    <div class="container">
        <div class="banner-box">
            <img src="/assets/images/svgs/info.svg" alt="Info icon" class="info-icon js-tosvg" />
            <div class="banner-content">
                @if (!string.IsNullOrEmpty(Model.Description.ReplacePTagFromRTE().ToString()))
                {
                    <div class="title-with-description">
                        @Html.Raw(Model.Description)
                    </div>
                }
                @if (Common.IsCtaNotNull(Model.PrimaryCta) || Common.IsCtaNotNull(Model.SecondaryCta))
                {
                    <div class="ctas-box">
                        @if (Common.IsCtaNotNull(Model.PrimaryCta))
                        {
                            <a href="@Model.PrimaryCta.Url" target="@Model.PrimaryCta.Target" class="sec-cta primary-btn light-bg">
                                <span class="btn-text buttonText20 medium16">@Model.PrimaryCta.Name</span>
                            </a>
                        }
                        @if (Common.IsCtaNotNull(Model.SecondaryCta))
                        {
                            <a href="@Model.SecondaryCta.Url" target="@Model.SecondaryCta.Target" class="sec-cta secondary-btn light-bg">
                                <span class="btn-text buttonText20 medium16">@Model.SecondaryCta.Name</span>
                            </a>
                        }
                    </div>
                }
            </div>
            <img src="/assets/images/svgs/banner-close.svg" alt="Close icon" class="close-icon js-tosvg" />
        </div>
    </div>
</section>

<!-- example 4 -->
<!-- fe code -->
  <section class="container">
      <div class="breadcrumb">
        <ul>
          <li>
            <a href="#">Home</a>
            <img src="../assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
          </li>
          <li>
            <a href="#">About us</a>
            <img src="../assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
          </li>
          <li>
            <a href="#">Our Story</a>
            <img src="../assets/images/svgs/chevon_right_without_dotted.svg" alt="" class="js-tosvg" />
          </li>
          <li class="active">
            <span>Our Team</span>
          </li>
        </ul>
      </div>
    </section>

<!-- what i made in umbraco -->

@using DMC.Common.Helpers
@using DMC.Common.Models.CMS
@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.AnnouncementBanner>
@{
var ViewLocation = ViewContext.ExecutingFilePath;
var currentLanguage = Context.Request.GetCurrentLanguage();
var heading = Common.GetDictionaryValueOrDefault(Constants.Dictionary.Home, currentLanguage);
}

<section class="banner-wrapper announcement-banner-top">
    <div class="container">
        <div class="banner-box">
            <img src="/assets/images/svgs/info.svg" alt="Info icon" class="info-icon js-tosvg" />
            <div class="banner-content">
                @if (!string.IsNullOrEmpty(Model.Description.ReplacePTagFromRTE().ToString()))
                {
                    <div class="title-with-description">
                        @Html.Raw(Model.Description)
                    </div>
                }
                @if (Common.IsCtaNotNull(Model.PrimaryCta) || Common.IsCtaNotNull(Model.SecondaryCta))
                {
                    <div class="ctas-box">
                        @if (Common.IsCtaNotNull(Model.PrimaryCta))
                        {
                            <a href="@Model.PrimaryCta.Url" target="@Model.PrimaryCta.Target" class="sec-cta primary-btn light-bg">
                                <span class="btn-text buttonText20 medium16">@Model.PrimaryCta.Name</span>
                            </a>
                        }
                        @if (Common.IsCtaNotNull(Model.SecondaryCta))
                        {
                            <a href="@Model.SecondaryCta.Url" target="@Model.SecondaryCta.Target" class="sec-cta secondary-btn light-bg">
                                <span class="btn-text buttonText20 medium16">@Model.SecondaryCta.Name</span>
                            </a>
                        }
                    </div>
                }
            </div>
            <img src="/assets/images/svgs/banner-close.svg" alt="Close icon" class="close-icon js-tosvg" />
        </div>
    </div>
</section>

<!-- exampl 5 -->

<body>
  <div class="sec-padded">
    <div class="container">
      <div class="secContentWrap" data-aos="fade-up">
        <p class="subTitle menu16">1% OF THE INDUSTRY</p>
        <h2 class="heading2"><u>Hub</u> for Media & Creativity</h2>
        <p class="body22">Dubai offers a media ecosystem where creativity and innovation thrive.</p>
      </div>
      <div class="table-wrapper">
        <div class="fine-table-container">
          <div class="table-row header">
            <div class="table-cell col-main">
              <h5 class="heading5">Type Of Fine</h5>
            </div>
            <div class="table-cell col-side">
              <h5 class="heading5">Fine Amount</h5>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida libero consectetur sit gravida libero
              </p>
            </div>
            <div class="table-cell col-side">
              <p class="body22">5,000 AED</p>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btnWrap" data-aos="fade-up" data-aos-delay="100">
        <a href="javascript:;" class="primary-btn dark-bg">
          <span class="btn-text buttonText20 medium16">long button name</span>
        </a>
        <a href="javascript:;" class="secondary-btn dark-bg">
          <span class="btn-text buttonText20 medium16">Button</span>
        </a>
      </div>
    </div>

  </div>
  <div class="sec-padded">
    <div class="container">
      <div class="secContentWrap" data-aos="fade-up">
        <p class="subTitle menu16">1% OF THE INDUSTRY</p>
        <h2 class="heading2"><u>Hub</u> for Media & Creativity</h2>
        <p class="body22">Dubai offers a media ecosystem where creativity and innovation thrive.</p>
      </div>
      <div class="table-wrapper">
        <div class="fine-table-container ratio-50-50">
          <div class="table-row header">
            <div class="table-cell col-main">
              <h5 class="heading5">Type Of Fine</h5>
            </div>
            <div class="table-cell col-side">
              <h5 class="heading5">Fine Amount</h5>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side">
              <p class="body22">5,000 AED</p>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btnWrap" data-aos="fade-up" data-aos-delay="100">
        <a href="javascript:;" class="primary-btn dark-bg">
          <span class="btn-text buttonText20 medium16">long button name</span>
        </a>
        <a href="javascript:;" class="secondary-btn dark-bg">
          <span class="btn-text buttonText20 medium16">Button</span>
        </a>
      </div>
    </div>

  </div>
  <div class="sec-padded">
    <div class="container">
      <div class="secContentWrap" data-aos="fade-up">
        <p class="subTitle menu16">1% OF THE INDUSTRY</p>
        <h2 class="heading2"><u>Hub</u> for Media & Creativity</h2>
        <p class="body22">Dubai offers a media ecosystem where creativity and innovation thrive.</p>
      </div>
      <div class="table-wrapper">
        <div class="fine-table-container ratio-30-70">
          <div class="table-row header">
            <div class="table-cell col-main">
              <h5 class="heading5">Type Of Fine</h5>
            </div>
            <div class="table-cell col-side">
              <h5 class="heading5">Fine Amount</h5>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side">
              <p class="body22">5,000 AED</p>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell col-main">
              <p class="main-text body22">
                Sed scelerisque at adipiscing consectetur sit gravida libero.
              </p>
              <p class="sub-text caption">
                Free Road Sed scelerisque at adipiscing consectetur sit gravida
                libero.
              </p>
            </div>
            <div class="table-cell col-side amount">
              <p class="body22">5,000 AED</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btnWrap" data-aos="fade-up" data-aos-delay="100">
        <a href="javascript:;" class="primary-btn dark-bg">
          <span class="btn-text buttonText20 medium16">long button name</span>
        </a>
        <a href="javascript:;" class="secondary-btn dark-bg">
          <span class="btn-text buttonText20 medium16">Button</span>
        </a>
      </div>
    </div>

  </div>
</body>

<!-- what i made -->

@using DMC.Common.Helpers
@using DMC.Common.Models.CMS
@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<DMC.Common.Models.CMS.TableWithHeadingDescriptionAndCta>
@{
var ViewLocation = ViewContext.ExecutingFilePath;
var currentLanguage = Context.Request.GetCurrentLanguage();
var heading = Common.GetDictionaryValueOrDefault(Constants.Dictionary.Home, currentLanguage);

    var hasHeading = !string.IsNullOrEmpty(Model?.Heading);
    var hasCaption = !string.IsNullOrEmpty(Model?.Caption);
    var tableWithRows = Model?.TableContent?.ToList() ?? new List<Umbraco.Cms.Core.Models.Blocks.BlockListItem>();
    var hasDescription = Model?.Description != null && !string.IsNullOrEmpty(Model.Description.ReplacePTagFromRTE().ToString());
    var hasPrimaryCta = Model?.PrimaryCta != null && Common.IsCtaNotNull(Model.PrimaryCta);
    var hasSecondaryCta = Model?.SecondaryCta != null && Common.IsCtaNotNull(Model.SecondaryCta);

    // Variant mapping based on your HTML examples
    var tableVariant = Model?.Design ?? "Left-Aligned Description";
    var ratioClass = string.Empty;

    if (tableVariant == "Equal-Spaced")
    {
        ratioClass = "ratio-50-50";
    }
    else if (tableVariant == "Right-Aligned Description") // Mapping to the 30-70 variant
    {
        ratioClass = "ratio-30-70";
    }
    else if (tableVariant == "Left-Aligned Description") // Mapping to the 30-70 variant
    {
        ratioClass = "";
    }

}

@using (new FunctionTracer(true, Model?.ContentType?.Alias ?? string.Empty))
{
if (Model != null)
{
try
{

<div class="sec-padded">
<div class="container">
@if (hasHeading || hasDescription || hasCaption)
{
<div class="secContentWrap" data-aos="fade-up">
@if (hasCaption)
{
<p class="subTitle menu16">@Model.Caption</p>
}
@if (hasHeading)
{
<h2 class="heading2">
@Html.Raw(Model.Heading.FormatHeading().ReplaceEMTagToITagFromRTE())
</h2>
}
@if (hasDescription)
{
<p class="body22">
@Model.Description
</p>
}
</div>
}

                    @if (tableWithRows.Any() || !string.IsNullOrEmpty(Model.LeftColumnHeading) || !string.IsNullOrEmpty(Model.RightColumnHeading))
                    {
                        <div class="table-wrapper"  data-aos="fade-up">
                            @* Dynamic class applied here: ratio-50-50, ratio-30-70, or empty *@
                            <div class="fine-table-container @ratioClass">
                                @if (!string.IsNullOrEmpty(Model.LeftColumnHeading) || !string.IsNullOrEmpty(Model.RightColumnHeading))
                                {
                                    <div class="table-row header">
                                        <div class="table-cell col-main">
                                            <h5 class="heading5">@(Model.LeftColumnHeading ?? string.Empty)</h5>
                                        </div>
                                        <div class="table-cell col-side">
                                            <h5 class="heading5">@(Model.RightColumnHeading ?? string.Empty)</h5>
                                        </div>
                                    </div>
                                }

                                @foreach (var blockItem in tableWithRows)
                                {
                                    var tableRow = blockItem.Content as TableWithHeadingDescription;
                                    if (tableRow == null) continue;

                                    string tablePrimaryText = tableRow.Heading ?? string.Empty;
                                    string tablePrimaryDescription = tableRow.Description?.ToString() ?? string.Empty;
                                    string tableSecondaryText = tableRow.SecondaryHeading?.ToString() ?? string.Empty;

                                    <div class="table-row">
                                        <div class="table-cell col-main">
                                            @if (!string.IsNullOrEmpty(tablePrimaryText))
                                            {
                                                <p class="main-text body22">@tablePrimaryText</p>
                                            }
                                            @if (!string.IsNullOrEmpty(tablePrimaryDescription))
                                            {
                                                <p class="sub-text caption">@tablePrimaryDescription</p>
                                            }
                                        </div>
                                        @* Added 'amount' class logic if needed, or kept standard per your CSHTML structure *@
                                        <div class="table-cell col-side">
                                            @if (!string.IsNullOrEmpty(tableSecondaryText))
                                            {
                                                <p class="body22">@tableSecondaryText</p>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    @if (hasPrimaryCta || hasSecondaryCta)
                    {
                        <div class="btnWrap" data-aos="fade-up" data-aos-delay="100">
                            @if (hasPrimaryCta)
                            {
                                <a href="@Model.PrimaryCta.Url" target="@(Model.PrimaryCta.Target ?? "_self")" class="primary-btn dark-bg">
                                    <span class="btn-text buttonText20 medium16">@Model.PrimaryCta.Name</span>
                                </a>
                            }
                            @if (hasSecondaryCta)
                            {
                                <a href="@Model.SecondaryCta.Url" target="@(Model.SecondaryCta.Target ?? "_self")" class="secondary-btn dark-bg">
                                    <span class="btn-text buttonText20 medium16">@Model.SecondaryCta.Name</span>
                                </a>
                            }
                        </div>
                    }
                </div>
            </div>
        }
        catch (Exception ex)
        {
            // Log ex
            throw;
        }
    }

}
