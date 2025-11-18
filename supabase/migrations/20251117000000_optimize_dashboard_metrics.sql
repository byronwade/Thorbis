-- Optimize customer dashboard metrics by moving calculations into the database
create or replace function public.customer_dashboard_metrics(p_company_id uuid)
returns table (
	total_customers bigint,
	active_customers bigint,
	prospect_customers bigint,
	total_revenue_cents bigint
)
language sql
security definer
set search_path = public
as $$
	select
		count(*) filter (where archived_at is null and deleted_at is null) as total_customers,
		count(*) filter (
			where archived_at is null and deleted_at is null and status = 'active'
		) as active_customers,
		count(*) filter (
			where archived_at is null and deleted_at is null and status = 'prospect'
		) as prospect_customers,
		coalesce(
			sum(total_revenue) filter (where archived_at is null and deleted_at is null),
			0
		) as total_revenue_cents
	from customers
	where company_id = p_company_id;
$$;

comment on function public.customer_dashboard_metrics(uuid) is
'
Summarizes customer counts and lifetime revenue for a single company.
Used by the dashboard stats so we never have to materialize all rows in application code.
';
