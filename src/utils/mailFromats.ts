
export  function emailVarificationFromat(verificationLink: string){

    const emailHtml = `
      <html>
        <body>
          <h1>Verify Your Email</h1>
          <p>Click the link below to verify:</p>
          <a href="${verificationLink}">Verify Email</a>
        </body>
      </html>
    `;

    return emailHtml;
}

