<?php
/**
 * Plugin Name:       Super Block
 * Description:       Super Gutenberg blocks for boosting up your productivity.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Anis Charolia
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dsb
 *
 * @package           super
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function terms_block_init() {
	register_block_type( __DIR__ . '/build/terms', array(
		'render_callback' => 'super_terms_block_render_content',		
	) );
}
add_action( 'init', 'terms_block_init' );

function super_terms_block_render_content($attr) {	
	
	$tax_name =    $attr['taxname'];
	$showHeading = $attr['showHeading'];
	$termslist =   $attr['terms'];
	$showImage =   $attr['showImage'];
	$styleName =   $attr['styleName'];
	$viewAllLink = $attr['viewAllLink'];
	
	if( ! empty($termslist)) {
		$terms = get_terms($tax_name, array(
			'include' => $termslist,
		) );
	}

	$finalData = array();
	
	foreach ( $terms as $index =>  $p ){
		$image = get_field('author_image', $attr['taxname'] . '_' . $p->term_id);
		if(empty($image)) {
			$image = plugin_dir_url( __FILE__ ) . '/img/noimage_person.png';	
		}
		$finalData[$index]['slug'] = $p->slug;
		$finalData[$index]['name'] = $p->name;
		$finalData[$index]['image'] = $image;
	}

	if( ! empty( $finalData ) ){
		$output = '<div class="super-terms-wrap '. $styleName .'"><div class="title-section">';

		if ($showHeading){
			$output .= '<h2 class="super-block-terms-heading">'.$attr['heading'].'</h2>';
		}
		if ($viewAllLink){
			$output .= '<a href="'. $viewAllLink .'" class="view-all-link">View All</a>';
		}
		$output .= '</div>';
		$output .= '<ul class="super-block terms">';
		foreach ( $finalData as $p ){			
			$output .= '<li class="term-item">';
			if($showImage){
				$output .= '<figure class="author-image"><a href="'. get_term_link( $p['slug'], $tax_name ).'"><img src="'. $p['image'] .'"></a></figure>';
			}			
			$output .= '<a href="'. get_term_link( $p['slug'], $tax_name ).'">' .  $p['name'] . '</a></img>';
		}
		$output .= '</ul></div>';
	}
	return $output ?? "<h3>Select Terms to populate</h3>";
}

function super_posts_block_init() {
	register_block_type( __DIR__ . '/build/super-posts', array(
		'render_callback' => 'super_posts_render_content',		
	) );
}
add_action( 'init', 'super_posts_block_init' );

function super_posts_render_content($attr) {
	ob_start();

	if ('' !== $attr['postType']){

		$args = array(
			'post_type' => $attr['postType'],
			'posts_per_page' => $attr['postNum'],			
			'order' => $attr['order'],
			'orderby' => $attr['orderBy'],
		);
	
		$the_query = new WP_Query( $args ); 
	
		if ( $the_query->have_posts() ) { ?>
			<ul class="super-posts-block-list layout-<?php echo $attr['layout'] ?>" style="background-color: <?php echo $attr['bgColor'];  ?>;color: <?php echo $attr['textColor'];?>">
				<?php while ( $the_query->have_posts() ) {
					$the_query->the_post();
					$postID = get_the_ID();
					$featuredImgUrl = get_the_post_thumbnail_url($postID, 'full');
					
					$imgUrl = '';
					if( empty($featuredImgUrl)) {					
						$imgUrl = plugin_dir_url( __FILE__ ) . '/img/featured-image.png';					
					} else {
						$imgUrl = $featuredImgUrl;
					}
					?>
					<li style="border-color: <?php echo $attr['textColor'];?>">
					<?
					if($attr['showImage']){ ?>
						<img src="<?php echo $imgUrl; ?>" alt="featured image">
					<?php }
					?>
						<<?php echo $attr['headingTag'] ?>>
							<a href="<?php echo the_permalink() ?>" style="color: <?php echo $attr['textColor'];?>"><?php echo get_the_title() ?> </a>
						</<?php echo $attr['headingTag'] ?>>						
						<?php 
							if($attr['showExcerpt']){
								echo the_excerpt();
							}
							if($attr['showButton']){
								echo '<a href="'. get_the_permalink() .'" class="view-button" style="border-color:'.$attr['textColor'].';color:'.$attr['textColor'].'">View Post</a>';
							}							
						?>

					</li>
				<?php } ?>
			</ul>
		<?php } else { ?>
	
		<p>No Post Found</p>
	
		<?php
		}
	} else {
		echo '<p>Select Post Type</p>';
	}

	
	$out = ob_get_clean();
	return $out;
}
