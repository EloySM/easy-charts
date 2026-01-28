-- Esta funcion saca las 5 categorias de gastos en las que mas dinero se ha gastado y tambien incluye otros que son el resto de las categorias sin contar las 5 con mas gastos, esto para el ultimo mes y tambien para el ultimo año
create or replace function public.get_top_categories_with_other(
  p_month int,
  p_year int,
  p_top int default 5
)
returns table ( -- Esto indica que devuelve una tablas con dos columnas una para textos(categorias) y otra para numeros(gasto total de la catergoria)
  label text,
  value numeric
)
language sql  -- Indica que el codigo es puramente SQL
stable  -- Es una optimizacion, hace que si se hace la misma consula en un corto periodo de tiempo, la base de datos cache el resultado y no recalcule
security invoker  -- La funcion se ejecuta con los permisos del usuario logeado, esto se hace para que solo se puedan mostrar los datos del usuario logeado y no de otros usuarios
as $$
  with sums as (  -- Con with se crean tablas temporales
    select
      c.name as category_name,
      sum(e.amount)::numeric as total -- ::numeric (type casting) asegura que el resultado sea un número decimal exacto
    from public.expenses e
    join public.categories c on c.id = e.category_id
    where e.user_id = auth.uid()  -- Esto es para sacar los resultados del usuario logueado
      and (p_month = 0 or extract(month from e.date)::int = p_month) -- Saca el numero del mes para compararlo con con el p_month que le es pasado, si no hay un numero de mes entonces se calculara el de todo el año
      and extract(year from e.date)::int = p_year -- Saca el numero del año para compararlo con el p_year que le es pasado
    group by c.name
  ),
  ranked as (
    select
      category_name,  -- El nombnre de la categoría
      total,  -- El gasto total en respectiva categoría
      row_number() over (order by total desc) as rn -- Esto crea un ranking con las 5 categorias con más gastos
    from sums
  )
  select
    case when rn <= p_top then category_name else 'Others' end as label,  -- Si el rn(rankin number) es 5 o menos entonce le deja el nombre original pero si no lo es entonces se le llama Others, con el fin de llamar de la misma forma a aquellas categorias que pertenezcan al top 5 de categorias mas costosas
    sum(total)::numeric as value  -- Esta es la columna del gasto de cada categoria
  from ranked
  group by case when rn <= p_top then category_name else 'Others' end -- Esto suma las categorias con el mismo nombre
  order by value desc;
$$;
