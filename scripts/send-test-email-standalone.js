#!/usr/bin/env node
/**
 * Standalone Test Email Script
 * 
 * Usage:
 *   node scripts/send-test-email-standalone.js <email-address>
 * 
 * Example:
 *   node scripts/send-test-email-standalone.js test@example.com
 */

const sgMail = require('@sendgrid/mail');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
function loadEnvFile() {
	const envPath = path.join(__dirname, '..', '.env.local');
	if (fs.existsSync(envPath)) {
		const content = fs.readFileSync(envPath, 'utf-8');
		content.split('\n').forEach(line => {
			const match = line.match(/^([^#=]+)=(.*)$/);
			if (match) {
				const key = match[1].trim();
				const value = match[2].trim().replace(/^["']|["']$/g, '');
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
		});
	}
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error('❌ Error: Email address is required');
		console.log('\nUsage:');
		console.log('  node scripts/send-test-email-standalone.js <email-address>');
		console.log('\nExample:');
		console.log('  node scripts/send-test-email-standalone.js test@example.com');
		process.exit(1);
	}

	const email = args[0];

	// Load environment variables
	loadEnvFile();

	// Check for SendGrid API key
	const apiKey = process.env.SENDGRID_API_KEY;
	if (!apiKey) {
		console.error('❌ Error: SENDGRID_API_KEY not found in environment variables');
		console.log('\nPlease set SENDGRID_API_KEY in .env.local or environment variables');
		process.exit(1);
	}

	console.log('📧 Sending test email via SendGrid...');
	console.log(`   To: ${email}`);
	console.log('');

	try {
		sgMail.setApiKey(apiKey);

		const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@thorbis.com';
		const fromName = process.env.SENDGRID_FROM_NAME || 'Thorbis';

		const msg = {
			to: email,
			from: `${fromName} <${fromEmail}>`,
			subject: 'Test Email - SendGrid Configuration',
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Test Email</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
						<h1 style="color: white; margin: 0;">✅ SendGrid Test Email</h1>
					</div>
					<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
						<p style="font-size: 16px; margin-bottom: 20px;">
							This is a test email from your Thorbis application to verify SendGrid configuration.
						</p>
						<div style="background: white; padding: 20px; border-radius: 4px; border-left: 4px solid #667eea; margin: 20px 0;">
							<p style="margin: 0; font-weight: bold;">Email Details:</p>
							<ul style="margin: 10px 0; padding-left: 20px;">
								<li><strong>Sent to:</strong> ${email}</li>
								<li><strong>From:</strong> ${fromName} &lt;${fromEmail}&gt;</li>
								<li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
							</ul>
						</div>
						<p style="font-size: 14px; color: #666; margin-top: 30px;">
							If you received this email, your SendGrid configuration is working correctly! 🎉
						</p>
					</div>
				</body>
				</html>
			`,
			text: `Test Email - SendGrid Configuration

This is a test email from your Thorbis application to verify SendGrid configuration.

Email Details:
- Sent to: ${email}
- From: ${fromName} <${fromEmail}>
- Timestamp: ${new Date().toLocaleString()}

If you received this email, your SendGrid configuration is working correctly!`,
		};

		const [response] = await sgMail.send(msg);
		const messageId = response.headers['x-message-id'];

		console.log('✅ Test email sent successfully!');
		console.log(`   Message ID: ${messageId || 'N/A'}`);
		console.log(`   Check your inbox at: ${email}`);
	} catch (error) {
		console.error('❌ Failed to send test email:');
		if (error.response) {
			console.error(`   Status: ${error.response.status}`);
			console.error(`   Error: ${JSON.stringify(error.response.body, null, 2)}`);
		} else {
			console.error(`   Error: ${error.message}`);
		}
		process.exit(1);
	}
}

main();


