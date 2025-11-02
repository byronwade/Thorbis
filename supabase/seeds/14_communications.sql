-- ============================================================================
-- SEED: Communications
-- ============================================================================
-- Creates 30 communication records (emails, SMS, calls, notes)
-- ============================================================================

DO $$
DECLARE
  v_company_id UUID := current_setting('app.current_company_id')::uuid;
  v_user_id UUID := current_setting('app.current_user_id')::uuid;

  -- Customer IDs
  v_sarah_chen_id UUID;
  v_michael_rodriguez_id UUID;
  v_jennifer_thompson_id UUID;
  v_robert_williams_id UUID;
  v_amanda_lee_id UUID;
  v_david_park_id UUID;
  v_maria_santos_id UUID;
  v_lisa_nguyen_id UUID;
  v_kevin_chang_id UUID;
  v_rachel_green_id UUID;
  v_techstart_id UUID;
  v_restaurant_id UUID;

  v_comm_counter INTEGER := 1;

BEGIN

  RAISE NOTICE 'Seeding Communications...';

  -- ============================================================================
  -- FETCH CUSTOMER IDS
  -- ============================================================================

  SELECT id INTO v_sarah_chen_id FROM customers WHERE email = 'sarah.chen@gmail.com';
  SELECT id INTO v_michael_rodriguez_id FROM customers WHERE email = 'michael.rodriguez@gmail.com';
  SELECT id INTO v_jennifer_thompson_id FROM customers WHERE email = 'jennifer.thompson@gmail.com';
  SELECT id INTO v_robert_williams_id FROM customers WHERE email = 'robert.williams@gmail.com';
  SELECT id INTO v_amanda_lee_id FROM customers WHERE email = 'amanda.lee@gmail.com';
  SELECT id INTO v_david_park_id FROM customers WHERE email = 'david.park@gmail.com';
  SELECT id INTO v_maria_santos_id FROM customers WHERE email = 'maria.santos@gmail.com';
  SELECT id INTO v_lisa_nguyen_id FROM customers WHERE email = 'lisa.nguyen@yahoo.com';
  SELECT id INTO v_kevin_chang_id FROM customers WHERE email = 'kevin.chang@gmail.com';
  SELECT id INTO v_rachel_green_id FROM customers WHERE email = 'rachel.green@gmail.com';
  SELECT id INTO v_techstart_id FROM customers WHERE email = 'facilities@techstart.io';
  SELECT id INTO v_restaurant_id FROM customers WHERE email = 'ops@riversidegroup.com';

  -- ============================================================================
  -- INCOMING CALLS (customer initiated)
  -- ============================================================================

  -- Sarah's emergency call
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by, notes
  ) VALUES (
    v_company_id, v_sarah_chen_id, 'phone_call', 'inbound', 'completed',
    'Emergency: No heat in main floor',
    'VIP customer called reporting furnace not working. Outside temp 42°F. Dispatched immediately for same-day emergency service.',
    '(415) 555-0101', '(415) 555-HVAC',
    '2024-10-15 13:45:00'::timestamp, v_user_id,
    'Duration: 4min. Customer priority service. Scheduled for 2:00 PM same day.'
  );

  -- Jennifer's AC issue
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_jennifer_thompson_id, 'phone_call', 'inbound', 'completed',
    'AC not cooling upstairs',
    'Customer reports upstairs zone not cooling properly. 10 degree temperature difference between floors. Scheduled diagnostic.',
    '(650) 555-0202', '(415) 555-HVAC',
    '2024-07-20 14:30:00'::timestamp, v_user_id
  );

  -- David's water heater emergency
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by,
    notes
  ) VALUES (
    v_company_id, v_david_park_id, 'phone_call', 'inbound', 'completed',
    'Water heater leaking - urgent',
    'Customer reports water heater leaking from bottom. Rust visible in hot water. 12 years old. Needs replacement.',
    '(415) 555-0303', '(415) 555-HVAC',
    '2024-07-30 16:20:00'::timestamp, v_user_id,
    'Duration: 6min. Scheduled replacement for Aug 5. Provided estimate over phone.'
  );

  -- Robert's furnace concern
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by,
    notes
  ) VALUES (
    v_company_id, v_robert_williams_id, 'phone_call', 'inbound', 'completed',
    'High gas bills - furnace concern',
    'Customer reports gas bills have doubled this winter. Furnace is original to 1960s home. Scheduled diagnostic.',
    '(415) 555-0404', '(415) 555-HVAC',
    '2024-11-01 10:15:00'::timestamp, v_user_id,
    'Duration: 8min. Customer concerned about costs. Explained diagnostic process. Scheduled for Nov 5.'
  );

  -- Restaurant emergency
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by,
    notes
  ) VALUES (
    v_company_id, v_restaurant_id, 'phone_call', 'inbound', 'completed',
    'URGENT: Dining AC down before lunch',
    'Restaurant manager reports main dining room AC not working. Outside temp 85°F. Lunch service in 90 minutes.',
    '(415) 555-0505', '(415) 555-HVAC',
    '2024-08-12 10:15:00'::timestamp, v_user_id,
    'Duration: 3min. Emergency dispatch. Arrived within 15 minutes. Resolved before lunch service.'
  );

  RAISE NOTICE '  ✓ Created 5 incoming phone call records';

  -- ============================================================================
  -- OUTBOUND CALLS (follow-ups, confirmations)
  -- ============================================================================

  -- Follow-up with Robert on estimate
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by,
    notes
  ) VALUES (
    v_company_id, v_robert_williams_id, 'phone_call', 'outbound', 'completed',
    'Follow-up: Furnace replacement estimate',
    'Called to follow up on furnace replacement estimate sent Nov 5. Customer reviewing options. Concerned about cost. Discussed financing options.',
    '(415) 555-HVAC', '(415) 555-0404',
    '2024-11-15 14:00:00'::timestamp, v_user_id,
    'Duration: 12min. Customer interested but budget-conscious. Offered 12-month financing. Will decide by end of month.'
  );

  -- Appointment confirmation - Amanda
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_amanda_lee_id, 'phone_call', 'outbound', 'completed',
    'Confirmation: Installation start date Dec 2',
    'Called to confirm installation start date and review project timeline. 5-day installation Dec 2-6. 50% deposit received.',
    '(415) 555-HVAC', '(650) 555-0606',
    '2024-11-28 10:30:00'::timestamp, v_user_id
  );

  -- TechStart quarterly reminder
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_techstart_id, 'phone_call', 'outbound', 'completed',
    'Q4 Maintenance Reminder',
    'Called to schedule Q4 quarterly maintenance. Confirmed Dec 6 at 7:00 AM. Will service all RTUs including server room.',
    '(415) 555-HVAC', '(415) 555-0707',
    '2024-11-25 11:00:00'::timestamp, v_user_id
  );

  RAISE NOTICE '  ✓ Created 3 outbound phone call records';

  -- ============================================================================
  -- EMAILS
  -- ============================================================================

  -- Service plan renewal - Sarah
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_email, to_email,
    created_at, created_by
  ) VALUES (
    v_company_id, v_sarah_chen_id, 'email', 'outbound', 'sent',
    'Your Premium Service Plan Renewal - March 2025',
    'Hi Sarah,

Your Premium Home Comfort Plan is up for renewal on March 15, 2025.

As a valued VIP customer, we wanted to reach out early to ensure uninterrupted coverage for all three HVAC zones at your Pacific Heights residence.

Your current plan includes:
- 3 maintenance visits per year
- Priority scheduling
- 15% discount on repairs
- No service call fees

We''ve been servicing your systems for 2 years, and they''re in excellent condition thanks to regular maintenance.

Would you like to renew for another year? We can also discuss the Total Home Care Plan which adds additional coverage.

Best regards,
Thorbis Service Team',
    'service@thorbis.com', 'sarah.chen@gmail.com',
    '2024-11-20 09:00:00'::timestamp, v_user_id
  );

  -- Estimate sent - Robert
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_email, to_email,
    created_at, created_by
  ) VALUES (
    v_company_id, v_robert_williams_id, 'email', 'outbound', 'sent',
    'Furnace Replacement Estimate - SAFETY PRIORITY',
    'Hi Robert,

Following our diagnostic visit on November 5, I''m sending the estimate for your furnace replacement.

IMPORTANT SAFETY NOTE: Your current furnace has a cracked heat exchanger, which creates a carbon monoxide risk. We strongly recommend replacement as soon as possible.

Estimate EST-2024-0012: $5,262.25
- New Carrier 96 AFUE 80,000 BTU furnace
- Code-compliant venting
- New thermostat
- Professional installation
- Permit included
- 10-year parts warranty

We offer 12-month financing with approved credit.

This estimate is valid until January 15, 2025.

Please let me know if you have any questions. I''m happy to discuss financing options or answer any concerns.

Best regards,
Thorbis',
    'service@thorbis.com', 'robert.williams@gmail.com',
    '2024-11-05 16:00:00'::timestamp, v_user_id
  );

  -- Invoice sent - Jennifer
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_email, to_email,
    created_at, created_by
  ) VALUES (
    v_company_id, v_jennifer_thompson_id, 'email', 'outbound', 'sent',
    'Invoice INV-2024-0002 - AC Repair Service',
    'Hi Jennifer,

Thank you for choosing Thorbis for your AC repair on July 22.

Invoice INV-2024-0002: $743.22
- AC refrigerant recharge (2 lbs R-410A)
- Leak detection and minor repair
- System performance test

Payment due: August 21, 2024

You can pay online at: https://thorbis.com/invoices/INV-2024-0002

We found a small leak in your evaporator coil. The system is working properly now, but please monitor it. If cooling issues return, the coil may need replacement.

Thank you for your business!

Best regards,
Thorbis',
    'billing@thorbis.com', 'jennifer.thompson@gmail.com',
    '2024-07-22 17:30:00'::timestamp, v_user_id
  );

  -- Welcome email - service plan member
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_email, to_email,
    created_at, created_by
  ) VALUES (
    v_company_id, v_lisa_nguyen_id, 'email', 'outbound', 'sent',
    'Welcome to the Thorbis Service Plan!',
    'Hi Lisa,

Welcome to the Thorbis Residential HVAC Maintenance Plan!

Your plan includes:
- 2 maintenance visits per year (spring AC, fall heating)
- 10% discount on all repairs
- Priority scheduling
- Filter replacements during visits

We''ll contact you in spring 2025 to schedule your first AC tune-up.

In the meantime, if you have any HVAC concerns, just give us a call. As a plan member, you get priority scheduling.

Thank you for choosing Thorbis!

Best regards,
Service Team',
    'service@thorbis.com', 'lisa.nguyen@yahoo.com',
    '2024-04-15 10:00:00'::timestamp, v_user_id
  );

  -- Maintenance reminder - Michael
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_email, to_email,
    created_at, created_by
  ) VALUES (
    v_company_id, v_michael_rodriguez_id, 'email', 'outbound', 'sent',
    'Upcoming: Fall Heating Maintenance - Sept 15',
    'Hi Michael,

This is a reminder about your scheduled fall heating maintenance on September 15 at 9:00 AM.

As part of your service plan, we''ll:
- Inspect your entire heating system
- Replace filter
- Check gas connections and combustion
- Test thermostat
- Ensure system is ready for winter

If you need to reschedule, please let us know at least 24 hours in advance.

We look forward to seeing you!

Best regards,
Thorbis',
    'service@thorbis.com', 'michael.rodriguez@gmail.com',
    '2024-09-13 14:00:00'::timestamp, v_user_id
  );

  RAISE NOTICE '  ✓ Created 5 email records';

  -- ============================================================================
  -- SMS MESSAGES
  -- ============================================================================

  -- Appointment reminder - same day
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_kevin_chang_id, 'sms', 'outbound', 'delivered',
    'Appointment Reminder',
    'Thorbis reminder: Your plumbing repair is scheduled for TODAY at 9:00 AM. We''ll text when our technician is on the way. Reply CONFIRM or call (415) 555-HVAC',
    '(415) 555-4822', '(415) 555-0808',
    '2024-09-25 07:30:00'::timestamp, v_user_id
  );

  -- On the way notification
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_maria_santos_id, 'sms', 'outbound', 'delivered',
    'Technician En Route',
    'Hi Maria, this is Thorbis. Your technician is on the way and will arrive in about 15 minutes for your kitchen drain service. See you soon!',
    '(415) 555-4822', '(415) 555-0909',
    '2024-08-20 09:45:00'::timestamp, v_user_id
  );

  -- Service complete notification
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_rachel_green_id, 'sms', 'outbound', 'delivered',
    'Service Complete',
    'Your ductwork sealing service is complete! Invoice INV-2024-0008 ($596.75) has been emailed. We appreciate your business! - Thorbis',
    '(415) 555-4822', '(415) 555-1010',
    '2024-10-28 12:50:00'::timestamp, v_user_id
  );

  -- Payment reminder (friendly)
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_maria_santos_id, 'sms', 'outbound', 'delivered',
    'Friendly Payment Reminder',
    'Hi Maria, this is Thorbis. Invoice INV-2024-0019 ($244.12) is now 15 days past due. We understand things get busy! Please let us know if you need help. (415) 555-HVAC',
    '(415) 555-4822', '(415) 555-0909',
    '2024-12-04 10:00:00'::timestamp, v_user_id
  );

  -- Estimate follow-up
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, from_contact, to_contact,
    created_at, created_by
  ) VALUES (
    v_company_id, v_robert_williams_id, 'sms', 'outbound', 'delivered',
    'Estimate Follow-up',
    'Hi Robert, following up on your furnace replacement estimate. Remember, your current furnace has a safety issue. We''d love to help. Can we answer any questions? - Thorbis',
    '(415) 555-4822', '(415) 555-0404',
    '2024-11-22 14:00:00'::timestamp, v_user_id
  );

  RAISE NOTICE '  ✓ Created 5 SMS records';

  -- ============================================================================
  -- INTERNAL NOTES
  -- ============================================================================

  -- Customer preference note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_sarah_chen_id, 'note', 'internal', 'completed',
    'VIP Customer Preferences',
    'VIP CUSTOMER - Priority service always. Prefers morning appointments 9-11 AM. Call cell phone for any scheduling changes. Has 3 properties - Pacific Heights is primary residence. Property manager coordinates service for other properties. Excellent payment history.',
    '2024-10-15 17:00:00'::timestamp, v_user_id
  );

  -- Technical note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_jennifer_thompson_id, 'note', 'internal', 'completed',
    'Refrigerant Leak - Monitor',
    'Small leak detected in evaporator coil during AC repair. Added 2 lbs R-410A. System operating properly but customer should monitor for cooling issues. If leak worsens, coil replacement will be necessary (~$2,500). Noted in equipment record.',
    '2024-07-22 15:50:00'::timestamp, v_user_id
  );

  -- Customer concern note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_robert_williams_id, 'note', 'internal', 'completed',
    'Budget-Conscious Customer',
    'Customer is price-sensitive and hesitant about $5K+ furnace replacement. However, current furnace is SAFETY HAZARD (cracked heat exchanger = CO risk). Offered financing. Follow up weekly. May need to emphasize safety risk to family. Customer works from home - flexible scheduling.',
    '2024-11-05 15:00:00'::timestamp, v_user_id
  );

  -- Property access note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_amanda_lee_id, 'note', 'internal', 'completed',
    'Property Access - Estate',
    'Large Hillsborough estate. Gate code: #4829. Property manager coordinates all service. Must schedule well in advance. Premium customer - use best equipment and provide white-glove service. Multiple high-end systems under warranty. Customer not price-sensitive.',
    '2024-11-15 14:30:00'::timestamp, v_user_id
  );

  -- Commercial account note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_techstart_id, 'note', 'internal', 'completed',
    'Critical Server Room AC',
    'IMPORTANT: Server room AC (RTU-2) is MISSION CRITICAL for business operations. Any issues with this unit are emergency priority. Must be serviced monthly per premium plan. Always double-check this unit during quarterly service. Building manager: Mike Thompson (mike@techstart.io)',
    '2024-09-10 11:45:00'::timestamp, v_user_id
  );

  -- Payment history note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_rachel_green_id, 'note', 'internal', 'completed',
    'Payment Issue - Collections?',
    'Invoice INV-2024-0020 is 30+ days overdue ($168.17). Multiple follow-ups sent. Customer not responding to calls or texts. May need to send to collections if no response by Dec 15. Consider requiring payment upfront for future service.',
    '2024-11-28 16:00:00'::timestamp, v_user_id
  );

  -- Service quality note
  INSERT INTO communications (
    company_id, customer_id, communication_type, direction, status,
    subject, body, created_at, created_by
  ) VALUES (
    v_company_id, v_restaurant_id, 'note', 'internal', 'completed',
    'Excellent Customer - Fast Payment',
    'Commercial customer (Riverside Restaurant Group) - 3 locations. Always pays within 15 days. Professional management. Appreciates quick emergency response. Good upsell potential for maintenance plans. Contact: Operations Manager ops@riversidegroup.com',
    '2024-08-12 12:30:00'::timestamp, v_user_id
  );

  RAISE NOTICE '  ✓ Created 7 internal note records';

  -- ============================================================================
  -- SUMMARY
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '  Communications Summary:';
  RAISE NOTICE '  - 5 Inbound calls (customer to business)';
  RAISE NOTICE '  - 3 Outbound calls (follow-ups, confirmations)';
  RAISE NOTICE '  - 5 Emails (estimates, invoices, reminders)';
  RAISE NOTICE '  - 5 SMS messages (appointment reminders, updates)';
  RAISE NOTICE '  - 7 Internal notes (customer preferences, technical notes)';
  RAISE NOTICE '  Total: 25 communication records';
  RAISE NOTICE '';

END $$;
