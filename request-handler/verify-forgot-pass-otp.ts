import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";

import { IUser } from "../types/IUser";

import { get5MinsExpirationDate } from "../controller/get5minsExpDate";

const verifyForgotPassOTP = (req: Request, res: Response) => {
    const otpInput = req.body.otp;

    const pendingOTPCookie = req.cookies.pendingOTP;

    const access_token_secret = process.env.ACCESS_TOKEN_SECRET as string;

    if(!pendingOTPCookie) return res.status(401).send("NO Pending OTP");

    jwt.verify(pendingOTPCookie, access_token_secret, async (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if(error) {
            res.status(401).send("OTP expired!");
        }
  
        if(decoded) {
            const {otp, user } = decoded as {otp: string, user: IUser};
            
            if(otp.trim() == otpInput.trim()) {
                const access_token_secret = process.env.ACCESS_TOKEN_SECRET as string;

                const expirationDate = get5MinsExpirationDate();

                const currentTimestamp = Math.floor(Date.now() / 1000);
                const expirationTimestamp = Math.floor(expirationDate.getTime() / 1000);

                const expiresIn = expirationTimestamp - currentTimestamp;

                const fpToken = jwt.sign({user, expDate: expirationDate }, access_token_secret, { expiresIn });

                const changePassLink = `http:/localhost:3009/app/reset-password/${fpToken}`;

                const config = {
                    service: 'gmail',
                    auth: {
                        user: process.env.GOOGLE_EMAIL,
                        pass: process.env.GOOGLE_MAIL_APP_PASS
                    }
                }
            
                const transport = nodemailer.createTransport(config);

                const message = {
                    from: process.env.GOOGLE_EMAIL,
                    to: user.email,
                    subject: "FBIMS - Test OTP Sender",
                    html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
                    <head>
                    <meta charset="UTF-8">
                    <meta content="width=device-width, initial-scale=1" name="viewport">
                    <meta name="x-apple-disable-message-reformatting">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta content="telephone=no" name="format-detection">
                    <title>New message</title><!--[if (mso 16)]>
                    <style type="text/css">
                    a {text-decoration: none;}
                    </style>
                    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
                    <xml>
                    <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
                    <style type="text/css">
                    #outlook a {
                    padding:0;
                    }
                    .es-button {
                    mso-style-priority:100!important;
                    text-decoration:none!important;
                    }
                    a[x-apple-data-detectors] {
                    color:inherit!important;
                    text-decoration:none!important;
                    font-size:inherit!important;
                    font-family:inherit!important;
                    font-weight:inherit!important;
                    line-height:inherit!important;
                    }
                    .es-desk-hidden {
                    display:none;
                    float:left;
                    overflow:hidden;
                    width:0;
                    max-height:0;
                    line-height:0;
                    mso-hide:all;
                    }
                    .es-button-border:hover a.es-button,
                    .es-button-border:hover button.es-button {
                    background:#56d66b!important;
                    }
                    .es-button-border:hover {
                    border-color:#42d159 #42d159 #42d159 #42d159!important;
                    background:#56d66b!important;
                    }
                    td .es-button-border:hover a.es-button-1 {
                    background:#f43e38!important;
                    }
                    td .es-button-border-2:hover {
                    background:#f43e38!important;
                    border-style:solid solid solid solid!important;
                    border-color:#42d159 #42d159 #42d159 #42d159!important;
                    }
                    @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .h-auto { height:auto!important } }
                    </style>
                    </head>
                    <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                    <div class="es-wrapper-color" style="background-color:#F6F6F6"><!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                    </v:background>
                    <![endif]-->
                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                    <tr>
                    <td valign="top" style="padding:0;Margin:0">
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                    <td align="center" style="padding:0;Margin:0">
                    <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;background-color:#027390;background-image:url(https://gqkxtu.stripocdn.email/content/guids/CABINET_05a633be1216949cdf9ff794df19c9de6a55388dfbeb76ea419f4be995d3570e/images/fbimsmessagetemplateheadingbg_YcI.png);background-repeat:repeat;background-position:center 40%" bgcolor="#027390" background="https://gqkxtu.stripocdn.email/content/guids/CABINET_05a633be1216949cdf9ff794df19c9de6a55388dfbeb76ea419f4be995d3570e/images/fbimsmessagetemplateheadingbg_YcI.png">
                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:20px;Margin:0;font-size:0px"><img class="adapt-img" src="https://gqkxtu.stripocdn.email/content/guids/CABINET_05a633be1216949cdf9ff794df19c9de6a55388dfbeb76ea419f4be995d3570e/images/fbimslogo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="69"></td>
                    </tr>
                    <tr>
                    <td align="center" style="padding:0;Margin:0;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#ffffff;font-size:11px"><i>"Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.”</i></p></td>
                    </tr>
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-bottom:15px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#ffffff;font-size:12px;text-align:center"><b>-Matthew 28:19-20 (NIV)</b></p></td>
                    </tr>
                    <tr>
                    <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0">
                    <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img src="https://gqkxtu.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png" alt="Fb" title="Facebook" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                    <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img src="https://gqkxtu.stripocdn.email/content/assets/img/social-icons/circle-colored/twitter-circle-colored.png" alt="Tw" title="Twitter" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                    <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img src="https://gqkxtu.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png" alt="Ig" title="Instagram" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                    <td align="center" valign="top" style="padding:0;Margin:0"><img src="https://gqkxtu.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" title="Youtube" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table>
                    <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                    <tr>
                    <td align="center" style="padding:0;Margin:0">
                    <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                    <tr>
                    <td align="left" style="padding:10px;Margin:0">
                    <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="left" style="padding:0;Margin:0;width:580px">
                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;color:#333333;font-size:16px">Reset Password Link</p></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-left:20px;padding-right:20px">
                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="${changePassLink}" target="_blank" hidden>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="${changePassLink}"
                    style="height:40px; v-text-anchor:middle; width:192px" arcsize="50%" strokecolor="#2cb543" strokeweight="1px" fillcolor="#31cb4b">
                    <w:anchorlock></w:anchorlock>
                    <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:14px; font-weight:400; line-height:14px; mso-text-raise:1px'>Reset Password</center>
                    </v:roundrect></a>
                    <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#31CB4B;border-width:0px 0px 2px 0px;display:inline-block;border-radius:20px;width:auto;mso-hide:all"><a href="${changePassLink}" class="es-button es-button-1684926304275" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;display:inline-block;background:#31CB4B;border-radius:20px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;padding:10px 20px;mso-padding-alt:0;mso-border-alt:10px solid #31CB4B">Reset Password</a></span><!--<![endif]--></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:20px;color:#333333;font-size:13px"><em>Link expires after : ${expirationDate}</em></p></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-left:20px;padding-right:20px">
                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>Query:</strong>&nbsp;Reset&nbsp;Password</p></td>
                    </tr>
                    <tr>
                    <td align="center" style="padding:20px;Margin:0;font-size:0">
                    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:unset;height:1px;width:100%;margin:0px"></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>Not you?</strong></p></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-left:20px;padding-right:20px">
                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Click the button below to Invalidate Request</p></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    <tr>
                    <td align="left" style="Margin:0;padding-top:15px;padding-left:20px;padding-right:20px;padding-bottom:40px">
                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                    <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="http://localhost:3009/invalidate" target="_blank" hidden>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="http://localhost:3009/invalidate"
                    style="height:41px; v-text-anchor:middle; width:138px" arcsize="50%" stroke="f" fillcolor="#ee130d">
                    <w:anchorlock></w:anchorlock>
                    <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px; mso-text-raise:1px'>Invalidate</center>
                    </v:roundrect></a>
                    <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-2 es-button-border" style="border-style:solid;border-color:#2cb543;background:#ee130d;border-width:0px;display:inline-block;border-radius:21px;width:auto;mso-hide:all"><a href="http://localhost:3009/invalidate" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;display:inline-block;background:#ee130d;border-radius:21px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;padding:10px 20px 10px 20px;mso-padding-alt:0;mso-border-alt:10px solid #31CB4B">Invalidate</a></span><!--<![endif]--></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table></td>
                    </tr>
                    </table>
                    </div>
                    </body>
                    </html>
                    `
                }
            
                transport.sendMail(message).then(response => {
                    res.clearCookie('pendingOTP');
                    return res.json({otpMatch: true, sendResetLinkSuccess: true});
                });

            } else {
                res.clearCookie('pendingOTP');
                res.json({otpMatch: false});
            }

        } else {
          res.status(401).send("OTP Expired!");
        }
    })
};

export default verifyForgotPassOTP;