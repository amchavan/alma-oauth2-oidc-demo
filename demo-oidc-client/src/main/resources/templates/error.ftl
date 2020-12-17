<html lang="en">
<head>
    <title>Demo Keycloak-secured Spring Boot app - error</title>
    <link rel="stylesheet"
		  href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.0/semantic.min.css"/>
 
</head>
<body>
<h1>Demo Keycloak-secured Spring Boot app</h1>
<h2>Error</h2>
<table>
    <tr>
        <td>Date</td>
        <td>${timestamp?datetime}</td>
    </tr>
    <tr>
        <td>Error</td>
        <td>${error}</td>
    </tr>
    <tr>
        <td>Status</td>
        <td>${status}</td>
    </tr>
    <tr>
        <td>Message</td>
        <td>${message}</td>
    </tr>
    <tr>
        <td>Exception</td>
        <td>${exception!"No exception thrown"}</td>
    </tr>
    <!-- <tr>
        <td>Trace</td>
        <td>
            <pre>${trace!"No Stacktrace available"}</pre>
        </td>
    </tr> -->
</table>
</body>
</html>
