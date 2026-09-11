import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { supabase } from '../config/supabase.js';
import { generateLotId, generateOfferId, generateTransactionId, generateReceiptId } from '../utils/generateId.js';
import { generateSafeQRPayload, generateTransactionQRSignature } from '../utils/qr.js';

async function seed() {
  if (!supabase) {
    console.error('❌ Cannot seed database: Supabase is not configured in .env');
    process.exit(1);
  }

  console.log('🌱 Starting Eco-Link Database Seeder...');

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('EcoLink@2026', salt);

  // 1. Seed Profiles
  console.log('Creating demo user profiles...');
  const users = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      full_name: 'Ramesh Kumar (Apex Scrap)',
      email: 'demo.collector@example.com',
      phone: '+919840123456',
      password_hash: defaultPasswordHash,
      role: 'collector',
      location: 'Chennai - Guindy Industrial Estate',
      latitude: 13.0067,
      longitude: 80.2025,
      is_active: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      full_name: 'GreenCycle Material Recovery Ltd',
      email: 'demo.recycler@example.com',
      phone: '+919840987654',
      password_hash: defaultPasswordHash,
      role: 'recycler',
      location: 'Ambattur Industrial Estate, Chennai',
      latitude: 13.0878,
      longitude: 80.1633,
      is_active: true
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      full_name: 'Apex E-Waste Solutions',
      email: 'pending.recycler@example.com',
      phone: '+919840555666',
      password_hash: defaultPasswordHash,
      role: 'recycler',
      location: 'Coimbatore - Peelamedu',
      latitude: 11.0168,
      longitude: 76.9558,
      is_active: true
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      full_name: 'Tamil Nadu CPCB Master Administrator',
      email: 'demo.admin@example.com',
      phone: '+919840000001',
      password_hash: defaultPasswordHash,
      role: 'admin',
      location: 'Chennai - Anna Salai',
      latitude: 13.0604,
      longitude: 80.2496,
      is_active: true
    }
  ];

  for (const user of users) {
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', user.email).maybeSingle();
    if (!existing) {
      const { error } = await supabase.from('profiles').insert([user]);
      if (error) console.error(`Error creating user ${user.email}:`, error.message);
      else console.log(`✓ Created user: ${user.email} (${user.role})`);
    } else {
      console.log(`- User already exists: ${user.email}`);
    }
  }

  // 2. Seed Recycler Profiles
  console.log('Creating recycler profiles...');
  const recyclers = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '22222222-2222-2222-2222-222222222222',
      facility_name: 'GreenCycle Material Recovery Ltd',
      cpcb_reg_number: 'CPCB-TN-EPR-2026-089',
      status: 'VERIFIED',
      categories: ['PCB / Electronic Components', 'Copper', 'Aluminium', 'Computer Equipment', 'Batteries'],
      monthly_capacity_kg: 5000,
      service_radius_km: 50,
      facility_address: 'Ambattur Industrial Estate, Chennai',
      latitude: 13.0878,
      longitude: 80.1633
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      user_id: '33333333-3333-3333-3333-333333333333',
      facility_name: 'Apex E-Waste Solutions',
      cpcb_reg_number: 'CPCB-TN-PENDING-441',
      status: 'PENDING',
      categories: ['Plastics', 'Ferrous Metals', 'Cables / Wires'],
      monthly_capacity_kg: 2000,
      service_radius_km: 50,
      facility_address: 'Coimbatore - Peelamedu',
      latitude: 11.0168,
      longitude: 76.9558
    }
  ];

  for (const rec of recyclers) {
    const { data: existing } = await supabase.from('recycler_profiles').select('id').eq('user_id', rec.user_id).maybeSingle();
    if (!existing) {
      const { error } = await supabase.from('recycler_profiles').insert([rec]);
      if (error) console.error(`Error creating recycler profile:`, error.message);
      else console.log(`✓ Created recycler profile: ${rec.facility_name} (${rec.status})`);
    }
  }

  // 3. Seed Waste Lots
  console.log('Creating initial waste lots...');
  const lot1Id = '55555555-5555-5555-5555-555555555555';
  const lot2Id = '66666666-6666-6666-6666-666666666666';

  const lots = [
    {
      id: lot1Id,
      lot_id: 'REQ-2026-881240',
      collector_id: '11111111-1111-1111-1111-111111111111',
      category: 'PCB / Electronic Components',
      material_type: 'High-Grade Telecom Server Motherboard PCBs',
      description: 'Telecom boards with gold/copper contacts. Certified non-working scrap.',
      quantity: 45,
      unit: 'kg',
      condition: 'Non-working / Scrap',
      location: 'Chennai - Guindy Industrial Estate',
      latitude: 13.0067,
      longitude: 80.2025,
      benchmark_rate: 650,
      min_fair_price: 488,
      max_fair_price: 813,
      status: 'AWAITING_OFFERS',
      qr_code_data: generateSafeQRPayload({
        lotId: 'REQ-2026-881240',
        category: 'PCB / Electronic Components',
        quantity: 45,
        unit: 'kg'
      })
    },
    {
      id: lot2Id,
      lot_id: 'REQ-2026-992110',
      collector_id: '11111111-1111-1111-1111-111111111111',
      category: 'Computer Equipment',
      material_type: 'Mixed Desktop Towers & Power Supply Units',
      description: 'Legacy office computers without storage media.',
      quantity: 120,
      unit: 'kg',
      condition: 'Mixed Condition',
      location: 'Chennai - Guindy Industrial Estate',
      latitude: 13.0067,
      longitude: 80.2025,
      benchmark_rate: 320,
      min_fair_price: 240,
      max_fair_price: 400,
      status: 'OFFERS_RECEIVED',
      qr_code_data: generateSafeQRPayload({
        lotId: 'REQ-2026-992110',
        category: 'Computer Equipment',
        quantity: 120,
        unit: 'kg'
      })
    }
  ];

  for (const lot of lots) {
    const { data: existing } = await supabase.from('waste_lots').select('id').eq('lot_id', lot.lot_id).maybeSingle();
    if (!existing) {
      const { error } = await supabase.from('waste_lots').insert([lot]);
      if (error) console.error(`Error creating lot:`, error.message);
      else {
        console.log(`✓ Created waste lot: ${lot.lot_id}`);
        // Add timeline
        await supabase.from('lot_timeline').insert([
          {
            lot_id: lot.id,
            event_type: 'CREATED',
            title: 'Waste Lot Registered',
            description: `${lot.quantity} ${lot.unit} ${lot.material_type} declared.`
          },
          {
            lot_id: lot.id,
            event_type: 'CLASSIFIED',
            title: 'Material Classified',
            description: `Category: ${lot.category} | Fair Band: ₹${lot.min_fair_price}–₹${lot.max_fair_price}/${lot.unit}`
          }
        ]);
      }
    }
  }

  // 4. Seed Offer on Lot 2
  console.log('Creating sample recycler offer...');
  const offer1Id = '77777777-7777-7777-7777-777777777777';
  const { data: existingOffer } = await supabase.from('offers').select('id').eq('id', offer1Id).maybeSingle();

  if (!existingOffer) {
    const { error: offErr } = await supabase.from('offers').insert([
      {
        id: offer1Id,
        offer_id: 'OFF-2026-1402',
        lot_id: lot2Id,
        recycler_id: '22222222-2222-2222-2222-222222222222',
        rate_per_unit: 335,
        total_amount: 40200,
        benchmark_rate: 320,
        min_fair_price: 240,
        max_fair_price: 400,
        price_status: 'FAIR',
        distance_km: 11.2,
        remarks: 'Direct factory truck with calibrated electronic weighbridge.',
        status: 'PENDING'
      }
    ]);
    if (offErr) console.error('Error creating offer:', offErr.message);
    else console.log('✓ Created offer: OFF-2026-1402');
  }

  console.log('\n==================================================');
  console.log('✅ Demo Data Seeded Successfully!');
  console.log('Demo Accounts:');
  console.log('  1. Collector: demo.collector@example.com / EcoLink@2026');
  console.log('  2. Recycler (Verified): demo.recycler@example.com / EcoLink@2026');
  console.log('  3. Recycler (Pending): pending.recycler@example.com / EcoLink@2026');
  console.log('  4. Admin: demo.admin@example.com / EcoLink@2026');
  console.log('==================================================\n');
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
