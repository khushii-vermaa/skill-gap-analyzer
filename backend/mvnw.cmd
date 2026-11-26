@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@SETLOCAL
@SET DIRNAME=%~dp0
@SET MVN_PORTABLE=%DIRNAME%..\tools\apache-maven-3.9.6\bin\mvn.cmd

@IF EXIST "%MVN_PORTABLE%" (
    CALL "%MVN_PORTABLE%" %*
) ELSE (
    mvn %*
)
